---
title: "Codebase Diving: Badger, a Key-Value store written in Go."
date: 2018-10-16T22:34:45+02:00
draft: true
---
When trying to understand a concept in programming, I often find it useful to look at existing code that implements this concept.
I wanted to have a better understanding of how databases efficiently read and write data to and from the disk. Most databases, as far as I'm aware, are written in C++, which I'm not familiar with. I am, however, quite familiar with Go, and several databases, especially embeddable databases, are available for Go. Here, embeddable means that the database is embedded in the code of the application rather than running as a separate process, or even on a separate (virtual) machine. I decided to take a look at the source code of [Badger](https://github.com/dgraph-io/badger).

## How Badger Works

[Badger](https://github.com/dgraph-io/badger) is a key-value database that you can use in Go programs.

I'll go over the parts of Badger's API you'll need to know to understand this post. You can also look at [Badger's documentation](https://godoc.org/github.com/dgraph-io/badger) You open a database like this, it'll be created if it doesn't exist:
```go
// Open the Badger database located in the /tmp/badger directory.
// It will be created if it doesn't exist.
opts := badger.DefaultOptions
opts.Dir = "/tmp/badger"
opts.ValueDir = "/tmp/badger"
db, err := badger.Open(opts)
if err != nil {
    log.Fatal(err)
}
```

This `opts.Dir` is the directory where our data will be stored. Don't worry about `opts.Values` for now, we'll get to that later.

Badger can be used by many goroutines (lightweight Threads, in case you're not familiar with Go). To ensure that you always get a consistent view of the database, all interactions with the database happen in transactions. There are read-only transactions, and read-write transactions.

To create a read-only transaction, you call `db.View` with a function. The transaction is only valid within that function.

```go
err := db.View(func(txn *badger.Txn) error {
  // Your code here…
  return nil
})
```

Read-write transactions are created in a similar way, with `db.Update`:

```go
err := db.Update(func(txn *badger.Txn) error {
  // Your code here…
  return nil
})
```

To write a key-value pair:

```go
err := txn.Set([]byte("answer"), []byte("42"))
```

To read the value associated with a key:
```go
tem, err := txn.Get([]byte("answer"))

var valNot, valCopy []byte
err := item.Value(func(val []byte) error {
    // This func with val would only be called if item.Value encounters no error.

    // Accessing val here is valid.
    fmt.Printf("The answer is: %s\n", val)

    // Copying or parsing val is valid.
    valCopy = append([]byte{}, val...)

    // Assigning val slice to another variable is NOT OK.
    valNot = val // Do not do this.
    return nil
})

// DO NOT access val here. It is the most common cause of bugs.
fmt.Printf("NEVER do this. %s\n", valNot)

// You must copy it to use it outside item.Value(...).
fmt.Printf("The answer is: %s\n", valCopy)
```

# Diving into the code.

I tried to understand the code in `badger.Open`, but it was setting up many things that I didn't understand, leading me to get a bit discouraged. Some time later, I decided to look at `txn.Set and `txn.Get`, because I have a better conceptual understanding of what they're doing; storing and retrieving data associated with a key. I can then look at how these methods call other parts of the codebase to accomplish this task.

## Setting a key's value

### `db.Update`

In order to set a value, we need to have a read-write transaction, so we call `db.Update`. Here's what its code looks like:

```go
// Update executes a function, creating and managing a read-write transaction
// for the user. Error returned by the function is relayed by the Update method.
// Update cannot be used with managed transactions.
func (db *DB) Update(fn func(txn *Txn) error) error {
	if db.opt.managedTxns {
		panic("Update can only be used with managedDB=false.")
	}
	txn := db.NewTransaction(true)
	defer txn.Discard()

	if err := fn(txn); err != nil {
		return err
	}

	return txn.Commit()
}
```

First, `Update` checks for an option named `managedTxns`. This option can be set to allow greater control over transactions.

Next, it creates a transaction using `db.NewTransaction`, passing in `true` to signify that the transaction should accept writes. Then, `txn.Discard` is called in a defer block. This ensures that the transaction gets cleaned up, no matter what happens.

Next, it's time to call the function that got passed in. If it returns an error, we just return that error. If it doesn't, we commit the transaction.

#### The `Txn` struct

`Update` handles the lifecycle of a transaction. Let's look at what a transaction holds.

```go
// Txn represents a Badger transaction.
type Txn struct {
	readTs   uint64
	commitTs uint64

	update bool     // update is used to conditionally keep track of reads.
	reads  []uint64 // contains fingerprints of keys read.
	writes []uint64 // contains fingerprints of keys written.

	pendingWrites map[string]*Entry // cache stores any writes done by txn.

	db        *DB
	discarded bool

	size         int64
	count        int64
	numIterators int32
}
```

`readTs` holds the timestamp up until which this transaction should see changes. Each transaction should only see changes that were made before the transaction was started.
`commitTs` will hold a timestamp indicating when the transaction was committed.

`update`, `reads` and `writes` are quite well-documented in the code. The fingerprints of keys mentioned here are just hashes. We'll encounter these later on.
`pendingWrites` is, as the comments say, a cache of changes to keys. Entries just represent changes to key. Since key-value pairs are the smallest piece of data in the database, they can't partially updated. A change to a key always completely changes the key, so we only need to keep track of one change per key in a transaction.

The transaction also keeps a reference to the database, and holds a boolean of whether it was discarded.

The `size` will hold the size of the transaction in bytes. `count` holds the number of entries in the transaction.
//TODO: explain `numIterations`

#### `db.NewTransaction`

Let's take a look at how transactions are created.

```go
// NewTransaction creates a new transaction. Badger supports concurrent execution of transactions,
// providing serializable snapshot isolation, avoiding write skews. Badger achieves this by tracking
// the keys read and at Commit time, ensuring that these read keys weren't concurrently modified by
// another transaction.
//
// For read-only transactions, set update to false. In this mode, we don't track the rows read for
// any changes. Thus, any long running iterations done in this mode wouldn't pay this overhead.
//
// Running transactions concurrently is OK. However, a transaction itself isn't thread safe, and
// should only be run serially. It doesn't matter if a transaction is created by one goroutine and
// passed down to other, as long as the Txn APIs are called serially.
//
// When you create a new transaction, it is absolutely essential to call
// Discard(). This should be done irrespective of what the update param is set
// to. Commit API internally runs Discard, but running it twice wouldn't cause
// any issues.
//
//  txn := db.NewTransaction(false)
//  defer txn.Discard()
//  // Call various APIs.
func (db *DB) NewTransaction(update bool) *Txn {
	return db.newTransaction(update, false)
}

func (db *DB) newTransaction(update, isManaged bool) *Txn {
	if db.opt.ReadOnly && update {
		// DB is read-only, force read-only transaction.
		update = false
	}

	txn := &Txn{
		update: update,
		db:     db,
		count:  1,                       // One extra entry for BitFin.
		size:   int64(len(txnKey) + 10), // Some buffer for the extra entry.
	}
	if update {
		txn.pendingWrites = make(map[string]*Entry)
		txn.db.orc.addRef()
	}
    
	// It is important that the oracle addRef happens BEFORE we retrieve a read
	// timestamp. Otherwise, it is possible that the oracle commit map would
	// become nil after we get the read timestamp.
	// The sequence of events can be:
	// 1. This txn gets a read timestamp.
	// 2. Another txn working on the same keyset commits them, and decrements
	//    the reference to oracle.
	// 3. Oracle ref reaches zero, resetting commit map.
	// 4. This txn increments the oracle reference.
	// 5. Now this txn would go on to commit the keyset, and no conflicts
	//    would be detected.
	// See issue: https://github.com/dgraph-io/badger/issues/574
	if !isManaged {
		txn.readTs = db.orc.readTs()
	}
	return txn
}
```

`newTransaction` first makes sure that `update` is false if our database is in read-only mode.
We then create the `&Txn` struct. 

The first two fields store whether this is a write-enabled transaction, and a reference to the database. `count` is the number of entries in our transaction. We'll get to what these entries are, and what this initial BitFin entry is. `size` holds the number of bytes it takes to store this transaction. txnKey is a slice of bytes that indicates the end of a transaction, so we need to have enough bytes to store it, plus some extra bytes for our initial entry. 

```go
txnKey = []byte("!badger!txn")  // For indicating end of entries in txn.
```

If this is a write-enabled transaction, we store a map of keys we're writing to. We then add a reference to the Oracle.
//TODO: explain more about what these references are.

The oracle is an object that keeps track of changes to our database and when they are made, so that all transactions see a consistent view of the database. Imagine for example that there are 2 goroutines, A and B, that are working on the database. They perform the following operations

1. A creates a transaction
2. B creates a transaction
3. B sets "message" to "B has written"
4. A reads "message".

Since A created a transaction before B wrote to the "message" key, it shouldn't see this value.

We then get a timestamp that we use to make sure we only read changes that are consistent with this transaction.

### `txn.Set`

We'll now look at the `txn.Set`, the function that actually writes the data.

```go
// Set adds a key-value pair to the database.
//
// It will return ErrReadOnlyTxn if update flag was set to false when creating the
// transaction.
//
// The current transaction keeps a reference to the key and val byte slice
// arguments. Users must not modify key and val until the end of the transaction.
func (txn *Txn) Set(key, val []byte) error {
	e := &Entry{
		Key:   key,
		Value: val,
	}
	return txn.SetEntry(e)
}
```

Looks simple enough, we create an entry, and set it in our transaction. Entries are changes to a specific key. Here's what `SetEntry` looks like:

```go
// SetEntry takes an Entry struct and adds the key-value pair in the struct,
// along with other metadata to the database.
//
// The current transaction keeps a reference to the entry passed in argument.
// Users must not modify the entry until the end of the transaction.
func (txn *Txn) SetEntry(e *Entry) error {
	return txn.modify(e)
}
```

Ok, so this just calls the private `modify()` method.

#### The `Entry` Struct

In the example above, an Entry just holds a `Key` and a `Value`, but it can hold a little bit more information about a change:

```go
// Entry provides Key, Value, UserMeta and ExpiresAt. This struct can be used by the user to set data.
type Entry struct {
	Key       []byte
	Value     []byte
	UserMeta  byte
	ExpiresAt uint64 // time.Unix
	meta      byte

	// Fields maintained internally.
	offset uint32
}

```

So an `Entry` holds a `Key` we want to change, and possibly the `Value` we want to set it to.
`UserMeta` can just hold a byte of metadata that the user wants to change. This is usually used to hold a bunch of booleans as individual bits, as we'll see with `Meta`.

`Meta` is used to hold bits of information that Badger wants to keep track of for a transaction. We do this by associating each piece of information with a power of 2. You can then store multiple values by applying a binary OR (`|` in Go).

Here are the possible values of this value in Badger;

````go
const (
	bitDelete                 byte = 1 << 0 // Set if the key has been deleted.
	bitValuePointer           byte = 1 << 1 // Set if the value is NOT stored directly next to key.
	bitDiscardEarlierVersions byte = 1 << 2 // Set if earlier versions can be discarded.

	// The MSB 2 bits are for transactions.
	bitTxn    byte = 1 << 6 // Set if the entry is part of a txn.
	bitFinTxn byte = 1 << 7 // Set if the entry is to indicate end of txn in value log.

	mi int64 = 1 << 20
)
````

If I wanted to specify that an entry is both a deletion, and part of a transaction, I'd say:

`e.Meta = bitDelete | bitTxn`

#### `txn.modify`

```go
func (txn *Txn) modify(e *Entry) error {
	const maxKeySize = 65000

	switch {
	case !txn.update:
		return ErrReadOnlyTxn
	case txn.discarded:
		return ErrDiscardedTxn
	case len(e.Key) == 0:
		return ErrEmptyKey
	case bytes.HasPrefix(e.Key, badgerPrefix):
		return ErrInvalidKey
	case len(e.Key) > maxKeySize:
		// Key length can't be more than uint16, as determined by table::header.  To
		// keep things safe and allow badger move prefix and a timestamp suffix, let's
		// cut it down to 65000, instead of using 65536.
		return exceedsSize("Key", maxKeySize, e.Key)
	case int64(len(e.Value)) > txn.db.opt.ValueLogFileSize:
		return exceedsSize("Value", txn.db.opt.ValueLogFileSize, e.Value)
	}

	if err := txn.checkSize(e); err != nil {
		return err
	}
	fp := farm.Fingerprint64(e.Key) // Avoid dealing with byte arrays.
	txn.writes = append(txn.writes, fp)
	txn.pendingWrites[string(e.Key)] = e
	return nil
}
```

The switch at the start is just a fancy way of checking for various error cases. The first case where the condition is `true` will be executed, and the appropriate error will be returned. Then, we check the total size of the transaction, to see if it's not getting too big.

We now get a fingerprint of the key we're modifying. This fingerprint is a hash using the [farmhash](https://github.com/dgryski/go-farm) function. We store it in our writes slice.
We also put the entity in our `pendingWrites` cache.

### `txn.Commit`

Now that we've made some changes to the database in our transaction, we'll commit them to the database.

```go
// Commit commits the transaction, following these steps:
//
// 1. If there are no writes, return immediately.
//
// 2. Check if read rows were updated since txn started. If so, return ErrConflict.
//
// 3. If no conflict, generate a commit timestamp and update written rows' commit ts.
//
// 4. Batch up all writes, write them to value log and LSM tree.
//
// 5. If callback is provided, Badger will return immediately after checking
// for conflicts. Writes to the database will happen in the background.  If
// there is a conflict, an error will be returned and the callback will not
// run. If there are no conflicts, the callback will be called in the
// background upon successful completion of writes or any error during write.
//
// If error is nil, the transaction is successfully committed. In case of a non-nil error, the LSM
// tree won't be updated, so there's no need for any rollback.
func (txn *Txn) Commit() error {
	txn.commitPrecheck() // Precheck before discarding txn.
	defer txn.Discard()

	if len(txn.writes) == 0 {
		return nil // Nothing to do.
	}

	txnCb, err := txn.commitAndSend()
	if err != nil {
		return err
	}
	// If batchSet failed, LSM would not have been updated. So, no need to rollback anything.

	// TODO: What if some of the txns successfully make it to value log, but others fail.
	// Nothing gets updated to LSM, until a restart happens.
	return txnCb()
}
```

The `txn.commitPreCheck` just makes sure that the db isn't in managed mode, and that our transaction is not discarded. We then defer `txn.Discard`, so that it gets discarded at the end of this function. If we didn't make any writes, we don't need to do anything else.

We then commit our changes, sending them off to be stored. `txnCb` is a callback to be invoked when the commit was successful.

#### `commitAndSend`

```go
func (txn *Txn) commitAndSend() (func() error, error) {
	orc := txn.db.orc
	// Ensure that the order in which we get the commit timestamp is the same as
	// the order in which we push these updates to the write channel. So, we
	// acquire a writeChLock before getting a commit timestamp, and only release
	// it after pushing the entries to it.
	orc.writeChLock.Lock()
	defer orc.writeChLock.Unlock()

	commitTs := orc.newCommitTs(txn)
	if commitTs == 0 {
		return nil, ErrConflict
	}

	// The following debug information is what led to determining the cause of
	// bank txn violation bug, and it took a whole bunch of effort to narrow it
	// down to here. So, keep this around for at least a couple of months.
	// var b strings.Builder
	// fmt.Fprintf(&b, "Read: %d. Commit: %d. reads: %v. writes: %v. Keys: ",
	// 	txn.readTs, commitTs, txn.reads, txn.writes)
	entries := make([]*Entry, 0, len(txn.pendingWrites)+1)
	for _, e := range txn.pendingWrites {
		// fmt.Fprintf(&b, "[%q : %q], ", e.Key, e.Value)

		// Suffix the keys with commit ts, so the key versions are sorted in
		// descending order of commit timestamp.
		e.Key = y.KeyWithTs(e.Key, commitTs)
		e.meta |= bitTxn
		entries = append(entries, e)
	}
	// log.Printf("%s\n", b.String())
	e := &Entry{
		Key:   y.KeyWithTs(txnKey, commitTs),
		Value: []byte(strconv.FormatUint(commitTs, 10)),
		meta:  bitFinTxn,
	}
	entries = append(entries, e)

	req, err := txn.db.sendToWriteCh(entries)
	if err != nil {
		orc.doneCommit(commitTs)
		return nil, err
	}
	ret := func() error {
		err := req.Wait()
		// Wait before marking commitTs as done.
		// We can't defer doneCommit above, because it is being called from a
		// callback here.
		orc.doneCommit(commitTs)
		return err
	}
	return ret, nil
}
```

We first get a lock on the commit channel, and then ask the Oracle for a commit timestamp. In the next section, I'll describe how the oracle gets this timestamp, but for now, just know that it checks for conflicts that may affect this transaction, and returns 0 if there are any. If the timestamp is 0, we return an error.

We then create a slice of all the entries in this transaction, where the keys get a suffix of this transaction's commit timestamp, so that when multiple versions of a key are sorted in order, they're sorted by when the change was made.

We then add a final entry that marks the end of this transaction, and send the entries to the writeChannel. This channel is used by the database to write changes to disk.
We now return a callback that'll wait for the database to finish writing the data to disk, and then tell the oracle that our data is committed.-

#### `db.sendToWriteCh`

````go

func (db *DB) sendToWriteCh(entries []*Entry) (*request, error) {
	if atomic.LoadInt32(&db.blockWrites) == 1 {
		return nil, ErrBlockedWrites
	}
	var count, size int64
	for _, e := range entries {
		size += int64(e.estimateSize(db.opt.ValueThreshold))
		count++
	}
	if count >= db.opt.maxBatchCount || size >= db.opt.maxBatchSize {
		return nil, ErrTxnTooBig
	}

	// We can only service one request because we need each txn to be stored in a contigous section.
	// Txns should not interleave among other txns or rewrites.
	req := requestPool.Get().(*request)
	req.Entries = entries
	req.Wg = sync.WaitGroup{}
	req.Wg.Add(1)
	db.writeCh <- req // Handled in doWrites.
	y.NumPuts.Add(int64(len(entries)))

	return req, nil
}
````

We first check if writes are blocked.
//TODO: explain why

We then go through all entries, and get their number and total size. We then check if there are too many entries, or the transaction is too big.

