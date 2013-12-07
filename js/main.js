
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
var pokemonData = []


var version = "0.9";

// From Modernizer
function hasLocalStoarge(){
    try {
        localStorage.setItem("mod", "mod");
        localStorage.removeItem("mod");
        return true;
    } catch(e) {
        return false;
    }
}
var ls = hasLocalStoarge() ? localStorage : undefined;

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

function PokemonCtrl($scope,$http,$interval){
    $http({method: 'GET', url: 'data\\pokemon.json'}).success(function(data, status, headers, config) {
        for(var i = 0; i < data.length; i++){
            $scope.pokemonNames.push({name : data[i].name, dex : i});
        }
        $scope.pokemonNames.sort(function(a,b){
            if(a.name > b.name) return 1;
            return -1;
        });
        $scope.selectedPokemon = $scope.pokemonNames[0];
        $scope.pokemonData = data;
    }).error(function(data, status, headers, config) {

    });
    
    $scope.pokemonNames = [];
    $scope.pokemonData;
    $scope.currentTeam = LinkedList();
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
    $scope.selectedPokemon = {};
    $scope.totalEvs = 1;
    $scope.init = function(){
        //var e = ls.getItem('team');
        //if(e) $scope.currentTeam = JSON.parse(e);
        //ls.removeItem('team');
    }
    $scope.getPokemon = function(dex){
        var pkmn = $scope.pokemonData[dex];
        var s = {
            hp : {name : 'Hp', evs : 0, ivs : 0, id : 'hp', total : 0},
            atk : {name : 'Attack', evs : 0, ivs : 0, id : 'atk', total : 0},
            def : {name : 'Defense', evs : 0, ivs : 0, id : 'def', total : 0},
            spa : {name : 'Special Attack', evs : 0, ivs : 0, id : 'spa', total : 0},
            spd : {name : 'Special Defense', evs : 0, ivs : 0, id : 'spd', total : 0},
            spe : {name : 'Speed', evs : 0, ivs : 0, id : 'spe', total : 0}
            };
        var ret = {
            pokemon : pkmn,
            nickname : "Bob Barker",
            stats : s,
            item : 'none',
            moves : [pkmn.moves[0],pkmn.moves[1],pkmn.moves[2],pkmn.moves[3]],
            ability : pkmn.abilities[0],
            nature : $scope.natures[0],
            horde : 1,
            pokerus : 1,
            power : 0,
            id : $scope.currentTeam.size(),
            active : true,
            totalEvs : 510,
            evOptions : {horde : 1, pokerus : 1, baseEv : 1, powerItem : 0, stat : {},total : 1}
        }
        s.hp.total = $scope.calcStat(ret,'hp');
        s.atk.total = $scope.calcStat(ret,'atk');
        s.def.total = $scope.calcStat(ret,'def');
        s.spa.total = $scope.calcStat(ret,'spa');
        s.spd.total = $scope.calcStat(ret,'spd');
        s.spe.total = $scope.calcStat(ret,'spe');
        return ret;
            
    }
    $scope.getBaseStat = function(pkmn,stat){
        return pkmn.pokemon.baseStats[stat]
    }
    $scope.addPokemon = function(){
        $scope.currentTeam.push($scope.getPokemon($scope.selectedPokemon.dex));
    }
    $scope.addEvs = function(pokemon){
        if(pokemon != undefined && pokemon.pokemon != undefined){
            if(pokemon.active == false) return;
            $scope.updateEvs(pokemon);
        }else{
            var sid = $scope.evOptions.stat.id;
            var p = $scope.currentTeam.getFirst();
            while(p != undefined){
                $scope.updateEvs(p.value,sid);
                p = p.next;
            }
        }
    }
    $scope.updateEvs = function(pkmn,statId){
        if(statId == undefined) statId = pkmn.evOptions.stat.id;
        var toAdd = 0;
        var oldEvs = 0;
        var toAdd = 0;
        var left = 0;
        if(pkmn.active == false) return;
        toAdd = $scope.calcEvs($scope.evOptions);
        oldEvs = parseInt(pkmn.stats[statId].evs,10);
        left = 252 - oldEvs;
        if(left < toAdd){
            toAdd = left;
        }
        if(toAdd >= pkmn.totalEvs){
            toAdd = pkmn.totalEvs;
        }
        pkmn.totalEvs -= toAdd;
        console.log(pkmn.totalEvs);
        pkmn.stats[statId].evs = parseInt(pkmn.stats[statId].evs,10) + toAdd;
        $scope.updateStat(pkmn,statId);
        if(pkmn.totalEvs == 0) pkmn.active = false;
    }
    $scope.updateStat = function(pkmn,statId){
        pkmn.stats[statId].evs = parseInt(pkmn.stats[statId].evs,10);
        pkmn.stats[statId].ivs = parseInt(pkmn.stats[statId].ivs,10);
        if(isNaN(pkmn.stats[statId].evs) || pkmn.stats[statId].evs < 0){
            pkmn.stats[statId].evs = 0;
        }else if(pkmn.stats[statId].evs > 252) pkmn.stats[statId].evs = 252;

        if(isNaN(pkmn.stats[statId].ivs) || pkmn.stats[statId].ivs < 0){
            pkmn.stats[statId].ivs = 0;
        }else if(pkmn.stats[statId].ivs > 31) pkmn.stats[statId].ivs = 31;
        pkmn.stats[statId].total = $scope.calcStat(pkmn,statId);
    }
    $scope.calcTotal = function(pkmn){
        return pkmn.stats.hp.evs + pkmn.stats.atk.evs + pkmn.stats.def.evs + pkmn.stats.spa.evs + pkmn.stats.spd.evs + pkmn.stats.spe.evs;
    }
    $scope.calcEvs = function(evo){
        return (evo.baseEv + evo.powerItem) * evo.horde * evo.pokerus;
    }
    $scope.toggleEvOption = function(evt,pokemon){
        var el = $(evt.target);
        el.toggleClass('active');
        if(el.hasClass("btn-horde")){
            if(pokemon == undefined) $scope.evOptions.horde = $scope.evOptions.horde == 5 ? 0 : 5;
            else pokemon.evOptions.horde = pokemon.evOptions.horde == 5 ? 0 : 5
        }else if(el.hasClass("btn-pokerus")){
            if(pokemon == undefined) $scope.evOptions.pokerus = $scope.evOptions.pokerus == 2 ? 0 : 2;
            else pokemon.evOptions.pokerus = pokemon.evOptions.pokerus == 2 ? 0 : 2;
        }else if(el.hasClass("btn-power-item")){
            if(pokemon == undefined) $scope.evOptions.powerItem = $scope.evOptions.powerItem == 4 ? 0 : 4;
            else pokemon.evOptions.powerItem = pokemon.evOptions.powerItem == 4 ? 0 : 4;
        }
        if(pokemon == undefined) $scope.totalEvs = $scope.calcEvs($scope.evOptions);
        else pokemon.evOptions.total = $scope.calcEvs(pokemon.evOptions);
    }
    $scope.calcStat = function(pkmn,statId){
        var t = 0;
        var base = pkmn.pokemon.baseStats[statId];
        var ivs = pkmn.stats[statId].ivs;
        var evs = pkmn.stats[statId].evs;
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
        console.log(pkmn);
        $("#pokemon-tbody-"+pkmn.id).children().each(function(index,el){
            el = $(el);
            el.removeClass("boost hinder");
            if(pkmn.nature.boost != ''){
                if(el.hasClass(pkmn.nature.boost+'-row')){
                    el.addClass('boost');
                }else if(el.hasClass(pkmn.nature.hinder + '-row')){
                    el.addClass('hinder');
                }
            }
        });
    }
    $scope.save = function(){
        ls.setItem('team', JSON.stringify($scope.currentTeam));
        console.log("Saving");
    }
    $scope.load = function(){
        console.log(ls.getItem('team'));
    }
    $scope.removePokemon = function(poke){

    }
    //$interval($scope.save,1000*5);
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        var pkmn = ngRepeatFinishedEvent.targetScope.this.$parent.pokemon; // ok?
        var tbod = $("#pokemon-tbody-"+pkmn.id);
        var rows = tbod.children();
        if(!rows.eq(0).hasClass('hp-row')){
            tbod.prepend(rows.eq(2));
        }
        $scope.updateTables(pkmn)
    });

}