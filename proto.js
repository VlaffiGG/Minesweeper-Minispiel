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
var z = 20;  // globale Variable, jede Zeile ist 20x20 Pixel groß

function setup() {
    createCanvas(161, 161);  // 1 Pixel größer, damit unten und rechts ein Rahmen erscheint
    spalten = floor(width/z);  // berechnet Anzahl der Spalten und verhindert float Werte
    reihen = floor(height/z);  // berechnet Anzahl der Reihen
    netz = erstelle2DArray(spalten, reihen);
    for (var i = 0; i < spalten; i++) {
        for (var j = 0; j < reihen; j++) {
            netz[i][j] = new Zeile(i*z, j*z, z);  // berechnet Pixel Standort jeder Zeile
        } // das Spielfeld besteht aus einem Netz von Zeilenobjekten
    }  // Spalten können als x und Reihen können als y verbildlicht werden
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

function Zeile(x, y, z) {  //Objekt für Zeilen
    this.x = x;
    this.y = y;
    this.z = z;
    if (random(1) < 0.5) {
        this.mine = true;
    } else {
        this.mine = false;
    }  // dies verteilt Minen zufällig auf 50% der Felder
    this.aufgeloest = false;
}  // unter diesen Bedingungen sind alle Zeilen verdeckt

Zeile.prototype.show = function() {
    stroke(0);
    noFill();
    rect(this.x, this.y, this.z, this.z);
    if (this.aufgeloest) {
        if (this.mine) {
            fill(127);
            square(this.x + this.z * 0.3, this.y + this.z * 0.3, this.z * 0.4);
        } else {
            fill(200);
            rect(this.x, this.y, this.z, this.z);
        }
    }
}

Zeile.prototype.contains = function(x, y) {
    return (x > this.x && x < this.x + this.z && y > this.y && y < this.y + this.z);
} //  das identifiziert, was genau als Zeile angesehen wird

Zeile.prototype.aufloesen = function() {
    this.aufgeloest = true;
} //  damit wird der Zeileninhalt veranschaulicht