---
layout: page
title: About the Theme
tags: [about, Jekyll, theme, responsive]
modified: 2014-08-08T20:53:07.573882-04:00
comments: true
---
<style>
.mono {
    font-family: "Lucida Console", Monaco, monospace;
}
</style>

## Settings
<div id="automatonSettings">
    <label for="initialState">Initial state:</label>
    <input type="text" id="initialState" value="...XX...XX...">
    <small>The initial state of the cells, specified as a line of X and . characters.</small>
    <label for="rule">Rule set:</label>
    <input type="number" min="0" max="255" step="1" value="30" id="rule" size="3" style="width:auto;"><br/>
    <small>Number between 0 and 255 inclusive.</small><br>
    <button id="run">Run!</button>
</div>

## Result:

### Rules:

<table id="rulesTable" class="mono" style="text-align:center;">
    
</table>

### Generations
---

<pre id="output" class="mono" style="font-size:4pt;"></pre>

<script>
document.addEventListener("DOMContentLoaded", function(event) { 
    var $run = $("#run"),
        $state = $("#initialState"),
        $rule = $("#rule"),
        $generations = $("#output"),
        $rulesTable = $("#rulesTable");
    
    $run.click(function(){
        var ruleSet = makeRuleSet($rule.val());
        makeRulesTable(ruleSet, $rulesTable);
        startGenerations(ruleSet, $generations, $state)
    });
});
function pad(num, len){
    var zeros = Math.max(len - num.length, 0)
    return Array(zeros + 1).join("0") + num
}

function makeRuleSet(rule){
    var binRule = pad(Number(rule).toString(2), 8).split("").reverse().join("");
    var result = [];
    for(var i=0; i<8; i++){
        result.push([
            bin2Symbols(pad(i.toString(2), 3)),
            bin2Symbols(binRule[i])
        ]);
    }
    return result;
}

function bin2Symbols(bin){
    return bin.replace(/0/g, ".").replace(/1/g, "X");
}

function makeRulesTable(ruleSet, $table){
    $table.empty();
    var $stateRow = $("<tr></tr>").append($("<th>State:</th>"));
    var $resultRow = $("<tr></tr>").append($("<th>Result:</th>"));
    for(var i=0; i<8; i++){
        var $stateCell = $("<td></td>").text(ruleSet[i][0]);
        var $resultCell = $("<td></td>").text(ruleSet[i][1]);
        $stateRow.append($stateCell);
        $resultRow.append($resultCell);
    }
    $table.append($stateRow);
    $table.append($resultRow);
};

function startGenerations(rules, $generations, $state) {
    var state = $state.val();
    var i = 0;
    window.intervalHandle = setInterval(function() {
        $generations.append(i + " " + state + "\r\n");
        i += 1;
        state = updateState(state, rules);
    }, 500)
}

function updateState(state, rules){
    var l = state.length;
    result = "";
    for(var i=0; i<l; i++){
        var s = state[saneModulo(i-1, l)] + state[i] + state[saneModulo(i+1, l)]
        var n = Number.parseInt(s.replace(/\./g, "0").replace(/X/g, "1"), 2);
        result += rules[n][1];
    }
    return result;
}

function saneModulo(a, n) {
    return ((a%n)+n)%n;
}

</script>
