// Warmup Projekt Minesweeper

function erstelle2DArray(spalten, reihen) {
    var ary = new Array(spalten);
    for (var i = 0; i < ary.length; i++) {
        ary[i] = new Array(reihen);
    }
    return ary;
}  // eine 2 dimensionale Data Struktur

var spalten = 10;
var reihen = 10;
var netz;  // globale Variable
var w = 20;  // globale Variable, jede Zeile ist 20x20 Pixel groß

function setup() {
    createCanvas(161, 161);
    spalten = floor(width/w);  // berechnet Anzahl der Spalten und verhindert float Werte
    reihen = floor(height/w);  // berechnet Anzahl der Reihen
    netz = erstelle2DArray(spalten, reihen);
    for (var i = 0; i < spalten; i++) {
        for (var j = 0; j < reihen; j++) {
            netz[i][j] = new Zeile(i*w, j*w, w);  // berechnet Pixel Standort jeder Zeile
        } // das Spielfeld besteht aus einem Netz von Zeilenobjekten
    }  // Spalten können als x, und Reihen können als y verbildlicht werden
}  // fuer jede Spalte und Reihe wird im Loop eine Zeile erstellt

function mousePressed() {
    for (var i = 0; i < spalten; i++) {
        for (var j = 0; j < reihen; j++) {
            if (netz[i][j].contains(mouseX, mouseY)) {
                netz[i][j].aufloesen();
            }  // damit wird determiniert, auf welchem Feld sich die Maus befand
        }
    }
}

function draw() {
    background(255);
    for (var i = 0; i < spalten; i++) {
        for (var j = 0; j < reihen; j++) {
            netz[i][j].show();
        }  // um zu sehen, was die Zeilen beinhalten
    }
}

// Code für Zeilen

function Zeile(x, y, w) {  //Objekt für Zeilen
    this.x = x;
    this.y = y;
    this.w = w;
    if (random(1) < 0.5) {
        this.mine = true;
    } else {
        this.mine = false;
    }  // dies verteilt Minen zufällig auf 10% der Felder
    this.aufgeloest = false;
}  // unter diesen Bedingungen sind alle Zeilen verdeckt

Zeile.prototype.show = function() {
    stroke(0);
    noFill();
    rect(this.x, this.y, this.w, this.w);
    if (this.aufgeloest) {
        if (this.mine) {
            square(this.x + this.w * 0.3, this.y + this.w * 0.3, this.w * 0.4);
        }
    }
}

Zeile.prototype.contains = function(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
} //  das Identifiziert, was genau als Zeile angesehen wird

Zeile.prototype.aufloesen = function() {
    this.aufgeloest = true;
} //  damit werden die Minen veranschaulicht