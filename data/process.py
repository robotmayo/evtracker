import csv
import os
import json

#I could make this faster but its only going to run once so w/e
data = os.getcwd()[:-4];

"""
Pokemon Data Structure

{
    name : String
    dexNumber : Int
    baseStats :{stat : Int}
    type : [Int, Int]
    moves : [String]
    abilities : [String]
}
"""
def getStats():
    return {'hp' : 0, 'atk' : 0, 'def' : 0, 'spa' : 0, 'spd' : 0, 'spe' : 0}
namesFile = open(data+'\\csv\\pokemon_species_names.csv','r');
reader = csv.reader(namesFile)
reader.next();
pokemon_data = [{'name' : "", 'dexNumber' : 0, 'baseStats' : getStats(), 'moves' : [], 'abilities' : [], 'type' : [] } for i in range(718) ];
print len(pokemon_data)
for row in reader:
    if(row[1] == '9'):
        pokemon_data[int(row[0])-1]['dexNumber'] = int(row[0]);
        pokemon_data[int(row[0])-1]['name'] = row[2]



abilitiesFile = open(data+"\\csv\\pokemon_abilities.csv",'r')
reader = csv.reader(abilitiesFile)
reader.next()
ability_data = [ [] for i in range(len(pokemon_data)) ]
for row in reader:
    if(int(row[0]) > 1000): 
        break
    ability_data[int(row[0])-1].append(int(row[1]))

abilityNames = open(data+"\\csv\\ability_names.csv",'r')
reader = csv.reader(abilityNames)
reader.next()
ability_names = []
for row in reader:
    if(row[1] == '9'): ability_names.append(row[2])


for p in range(len(ability_data)):
    pokemon_data[p]['abilities'] = [ability_names[e-1] for e in ability_data[p]]

pokemonTypes = open(data+"\\csv\\pokemon_types.csv",'r')
reader = csv.reader(pokemonTypes)
reader.next()
for row in reader:
    if(int(row[0])-1 > 1000):break
    pokemon_data[int(row[0])-1]['type'].append(int(row[1]));

typeNames = open(data+"\\csv\\type_names.csv",'r')
reader = csv.reader(typeNames)
reader.next()
type_names = []
for row in reader:
    if(row[1] == '9'): type_names.append(row[2])

for p in pokemon_data:
    p['type'] = [type_names[e-1] for e in p['type']]

stats = open(data+"\\csv\\pokemon_stats.csv",'r')
reader = csv.reader(stats)
reader.next()
for row in reader:
    if(int(row[0]) > 1000): break
    if(row[1] == '1'):
        pokemon_data[int(row[0])-1]['baseStats']['hp'] = int(row[2])
    elif row[1] == '2':
        pokemon_data[int(row[0])-1]['baseStats']['atk'] = int(row[2])
    elif row[1] == '3':
        pokemon_data[int(row[0])-1]['baseStats']['def'] = int(row[2])
    elif row[1] == '4':
        pokemon_data[int(row[0])-1]['baseStats']['spa'] = int(row[2])
    elif row[1] == '5':
        pokemon_data[int(row[0])-1]['baseStats']['spd'] = int(row[2])
    elif row[1] == '6':
        pokemon_data[int(row[0])-1]['baseStats']['spe'] = int(row[2])


moves = open(data+"\\csv\\pokemon_moves.csv",'r')
reader = csv.reader(moves)
reader.next()
for row in reader:
    if(int(row[0]) > 1000): break
    if(int(row[1]) == 15):
        pokemon_data[int(row[0])-1]['moves'].append(int(row[2]))

moveNames = open(data+"\\csv\\move_names.csv",'r')
reader = csv.reader(moveNames)
reader.next()
move_names = []
for row in reader:
    if(int(row[0]) > 1000):
        break;
    if(row[1] == '9'):
        move_names.append({'name' : row[2], 'id' : int(row[0])})

# IM SORRY IM SO SORRY
for p in pokemon_data:
    for i in range(len(p['moves'])):
        for n in move_names:
            if(n['id'] == p['moves'][i]):
                p['moves'][i] = n['name']
                break

pj = open('pokemon.json','w')
pj.write(json.dumps(pokemon_data))