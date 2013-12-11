import urllib2
import os
import json
#from bs4 import BeautifulSoup as BS
cwd = os.getcwd()
os.chdir('../img')
imgfolder = os.getcwd()
os.chdir(cwd)
def downloadPokemon(name):
	html = urllib2.urlopen('http://img.pokemondb.net/artwork/%s.jpg'%name)
	wf = open(imgfolder+'\\'+name+".jpg",'wb')
	wf.write(html.read())
	wf.close()


pkmn = json.loads(open('pokemon.json','r').read());
for e in pkmn: