
var defaultPokemon = {
    name : "Xerneas",
    nationalDexNumber : 716,
    baseStats : {
        hp : 126,
        atk : 131,
        def : 95,
        spa : 131,
        spd : 98,
        spe : 99,
        total : 680
    },
    type : [17],
    typeDefense : [{type : 7, mul : .5}],
    moves : {levelup : [{}],egg:[{}],machine:[{}] },
    breeding : {eggGroups : [0], gender : 2, steps : 0},
    evoChain : [{}]
}

var displayArray = [];
var displayStates = {
    horde : true,
    pokerus : false
}
var pokemonNames = []
var pokemonData = []
$.getJSON("data\\pokemon.json", function(json) {
    for(var i = 0; i < json.length; i++){
        pokemonNames.push(json[i].name)
    }
    pokemonData = json;
});

var version = "0.9"



function updateStat(pkmn,eiv,stat,val){
    var e = pkmn.stats[stat][eiv] + val;
    if(e < 0){
        pkmn.stats[stat][eiv] = e = 0;
    }else{
        switch(eiv){
            case 'iv':
                if(e > 31){
                    pkmn.stats[stat][eiv] = e = 31;
                }
                break;
            case 'ev':
                if(e > 252){
                    pkmn.stats[stat][eiv] = e = 252;
                }
                break;
            default:
                console.log("Something went wrong in updateStat", arguments);
                return -1;
        }
    }
    return e;
}




// Fucking Angular, never again
var team = [];
var $evSettings = $('#ev-settings');
var pokemonDisplayHtml = $("#pokemon-display").html();
var pokemonCtrl = {};
var pokemonRow = $("#pokemon-row");
var app = angular.module('EvTracker', []);
app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});

function PokemonCtrl($scope){
    $scope.team = [];
    $scope.evOptions = {horde : 1, pokerus : 1, baseEv : 1, powerItem : 0, stat : {}};
    $scope.evStats = [
        {name : 'Hp', id :'hp'},
        {name : 'Attack', id :'atk'},
        {name : 'Defense', id :'def'},
        {name : 'Special Atack', id :'spa'},
        {name : 'Special Defense', id :'spd'},
        {name : 'Speed', id :'spe'}
        ];
    $scope.baseEvO = [1,2,3];
    $scope.stateOrder = ['hp','atk','def','spa','spd','spe'];
    $scope.natures = [
        {name : 'Adamant', boost : 'atk', hinder : 'spa'},
        {name : 'Bashful', boost : '', hinder : ''},
        {name : 'Bold', boost : 'def', hinder : 'atk'},
        {name : 'Brave', boost : 'atk', hinder : 'spe'},
        {name : 'Calm', boost : 'spd', hinder : 'atk'},
        {name : 'Careful', boost : 'spd', hinder : 'spa'},
        {name : 'Docile', boost : '', hinder : ''},
        {name : 'Gentle', boost : 'spd', hinder : 'def'},
        {name : 'Hardy', boost : '', hinder : ''},
        {name : 'Hasty', boost : 'spe', hinder : 'def'},
        {name : 'Impish', boost : 'def', hinder : 'spa'},
        {name : 'Jolly', boost : 'spe', hinder : 'spa'},
        {name : 'Lax', boost : 'def', hinder : 'spd'},
        {name : 'Lonely', boost : 'atk', hinder : 'def'},
        {name : 'Mild', boost : 'spa', hinder : 'def'},
        {name : 'Modest', boost : 'spa', hinder : 'atk'},
        {name : 'Naive', boost : 'spe', hinder : 'spd'},
        {name : 'Naughty', boost : 'atk', hinder : 'spd'},
        {name : 'Quiet', boost : 'spa', hinder : 'spe'},
        {name : 'Quirky', boost : '', hinder : ''},
        {name : 'Rash', boost : 'spa', hinder : 'spd'},
        {name : 'Relaxed', boost : 'def', hinder : 'spd'},
        {name : 'Sassy', boost : 'spd', hinder : 'spe'},
        {name : 'Serious', boost : '', hinder : '' },
        {name : 'Timid', boost : 'spe', hinder : 'atk'},
    ];
    $scope.getPokemon = function(dex){
        var pkmn = pokemonData[dex]
        return {
            pokemon : pkmn,
            nickname : "Bob Barker",
            stats : {
                hp : {name : 'Hp', evs : 0, ivs : 0, id : 'hp', total : $scope.calcStat(pkmn.baseStats.hp,0,0,1,true)},
                atk : {name : 'Attack', evs : 0, ivs : 0, id : 'atk', total : $scope.calcStat(pkmn.baseStats.atk,0,0,1)},
                def : {name : 'Defense', evs : 0, ivs : 0, id : 'def', total : $scope.calcStat(pkmn.baseStats.def,0,0,1)},
                spa : {name : 'Special Attack', evs : 0, ivs : 0, id : 'spa', total : $scope.calcStat(pkmn.baseStats.spa,0,0,1)},
                spd : {name : 'Special Defense', evs : 0, ivs : 0, id : 'spd', total : $scope.calcStat(pkmn.baseStats.spd,0,0,1)},
                spe : {name : 'Speed', evs : 0, ivs : 0, id : 'spe', total : $scope.calcStat(pkmn.baseStats.spe,0,0,1)}
            },
            item : 'none',
            moves : [pkmn.moves[0],pkmn.moves[1],pkmn.moves[2],pkmn.moves[3]],
            ability : pkmn.abilities[0],
            nature : $scope.natures[1],
            horde : 1,
            pokerus : 1,
            power : 0,
            id : $scope.team.length,
            active : true
        }
    }
    $scope.getBaseStat = function(pkmn,stat){
        return pkmn.pokemon.baseStats[stat]
    }
    $scope.addPokemon = function(){
        $scope.team.push($scope.getPokemon(Math.floor(Math.random()*716)));
        console.log($scope.team[$scope.team.length-1])
    }
    $scope.addEvs = function(){
        var pkmn = {};
        var statId = $scope.evOptions.stat;
        var total = $scope.calcEvs(evOptions);
        for(var i = 0; i < $scope.team.length; i++){
            pkmn = $scope.team[i];
            pkmn.stats[statId].ev = parseInt(pkmn.stats[statId].ev,10) + total;
            $scope.updateStat(pkmn,statId);
        }
    }
    $scope.updateStat = function(pkmn,statId){
        //@TODO: FINISH REWRITE OF STAT UPDATES
        pkmn.stats[statId].ev = parseInt(pkmn.stats[statId].ev,10);
        pkmn.stats[statId].iv = parseInt(pkmn.stats[statId].iv,10);
        if(isNaN(pkmn.stats[statId].ev) || pkmn.stats[statId].ev < 0){
            pkmn.stats[statId].ev = 0;
        }else if(pkmn.stats[statId].ev > 252) pkmn.stats[statId].ev = 252;

        if(isNaN(pkmn.stats[statId].iv) || pkmn.stats[statId].iv < 0){
            pkmn.stats[statId].iv = 0;
        }else if(pkmn.stats[statId].iv > 31) pkmn.stats[statId].iv = 31;
        pkmn.stats[statId].total = $scope.calcTotal(pkmn,statId);
    }
    $scope.calcEvs = function(evo){
        return (evo.baseEv + evo.powerItem) * evo.horde * evo.pokerus;
    }
    $scope.toggleEvOption = function(evt){
        var el = $(evt.target);
        el.toggleClass('active');
        if(el.is("#btn-horde")){
            $scope.evOptions.horde = $scope.evOptions.horde == 5 ? 0 : 5;
        }else if(el.is("#btn-pokerus")){
            $scope.evOptions.pokerus = $scope.evOptions.pokerus == 2 ? 0 : 2;
        }else if(el.is("#btn-power-item")){
            $scope.evOptions.powerItem = $scope.evOptions.powerItem == 4 ? 0 : 4;
        }
    }
    $scope.calcStat = function(pkmn,statId){
        var t = 0;
        var base = pkmn.pokemon.baseStats[statId];
        var ivs = pkmn.stats[statId].ivs;
        var evs= pkmn.stats[statId].evs;
        var nature = 1;
        if(pkmn.nature.boost == statId) nature = 1.1;
        else if(pkmn.hinder == statId) nature = .9;
        if(statId == "hp"){
            t = (ivs + (2*base) + (evs/4) + 100) * 100;
            t = (t/100)+10;
            return Math.floor(t);
        }else{
            t = (ivs + (2*base) + (evs/4)) * 100;
            t = (t/100)+5;
            return Math.floor(t * nature);
        }
    }
    $scope.updateTables = function(pkmn){
        console.log("Running");
        $("#pokemon-tbody-"+pkmn.id).children().each(function(index,el){
            el = $(el);
            el.removeClass("boost hinder");
            if(pkmn.nature.boost != ''){
                if(el.hasClass(pkmn.nature.boost+'-row')){
                    el.addClass('boost');
                    console.log("Added Boost")
                }else if(el.hasClass(pkmn.nature.hinder + '-row')){
                    el.addClass('hinder');
                    console.log("Added Hinder");
                }
            }
        });
    }
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        var pkmn = ngRepeatFinishedEvent.targetScope.this.$parent.pokemon; // ok?
        console.log($("#pokemon-tbody-"+pkmn.id));
        var tbod = $("#pokemon-tbody-"+pkmn.id);
        var rows = tbod.children();
        if(!rows.eq(0).hasClass('hp-row')){
            tbod.prepend(rows.eq(2));
        }
        $scope.updateTables(pkmn)
    });

}