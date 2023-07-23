// Warmup Projekt Minesweeper - Vladimir Zyuzin

function erstelle2DArray(spalten, reihen) {
    var ary = new Array(spalten);
    for (var i = 0; i < ary.length; i++) {
        ary[i] = new Array(reihen);
    }
    return ary;
}  // eine 2 dimensionale Data Struktur

var gesamteMinen = 12;
var spalten = 10;
var reihen = 10;
var netz;  // globale Variable
var z = 20;  // globale Variable, jede Zeile ist 20x20 Pixel groß
var markedFields = gesamteMinen; // initializiert den Zähler mit der gesamten Anzahl der Minen


function setup() {
    createCanvas(181, 181);  // 1 Pixel groeßer, fuer einen Rahmen unten und rechts
    canvas = document.getElementById('defaultCanvas0');
    canvas.addEventListener('contextmenu', function(e) {
        e.preventDefault();  // verhindert die originale Funktion eines Rechtklicks
    });

    spalten = floor(width/z);  // berechnet Anzahl der Spalten und verhindert float Werte
    reihen = floor(height/z);  // berechnet Anzahl der Reihen
    netz = erstelle2DArray(spalten, reihen);
    for (var i = 0; i < spalten; i++) {
        for (var j = 0; j < reihen; j++) {
            netz[i][j] = new Zeile(i, j, z);  // berechnet Pixel Standort jeder Zeile
        }
    }

    var optionen = [];
    for (var i = 0; i < spalten; i++) {
        for (var j = 0; j < reihen; j++)  {
            optionen.push([i, j]);  // waehlt die gesamteMinen Zeilen aus
        }
    }

    for (var n = 0; n < gesamteMinen; n++) {
        var index = floor(random(optionen.length));
        var auswahl = optionen[index];
        var i = auswahl[0];
        var j = auswahl[1];
        optionen.splice(index, 1);
        netz[i][j].mine = true;
    }  // loescht die gewaehlte Zeile aus der Liste aller weiteren Optionen

    for (var i = 0; i < spalten; i++) {
        for (var j = 0; j < reihen; j++) {
            netz[i][j].zaehleMinen();  // zaehlt alle Nachbarzeilen
        }
    }

     // das Spielfeld besteht aus einem Netz von Zeilenobjekten
    // Spalten können als x und Reihen koennen als y verbildlicht werden
}  // fuer jede Spalte und Reihe wird im Loop eine Zeile erstellt

function mousePressed() {
    // überprüft, ob das Spiel bereits gewonnen oder verloren wurde
    if (checkGameWon() || isGameOver()) {
        return;
    }

    for (var i = 0; i < spalten; i++) {
        for (var j = 0; j < reihen; j++) {
            if (netz[i][j].beinhaltet(mouseX, mouseY)) {
                if (mouseButton === RIGHT) {
                    if (netz[i][j].markiert) {
                        markedFields++; // wenn eine markierte Zeile gerechtsklickt wird, erhöht sich der Zähler
                    } else {
                        markedFields--; // wenn eine unmarkierte Zeile gerechtsklickt wird, verringert sich der Zähler
                    }
                    netz[i][j].markiert = !netz[i][j].markiert;
                    updateCounter(); // ruft Funktion zum Update der Zähler Anzeige
                } else {
                    netz[i][j].aufloesen();

                    if (netz[i][j].mine) {
                        gameOver();
                    } else if (checkGameWon()) {
                        gameWon();
                    }
                }
            }
        }
    }
}

function updateCounter() {
    var counterElement = document.getElementById("counter");
    counterElement.innerText = "Minen: " + markedFields;
}

function draw() {
    background(255);
    for (var i = 0; i < spalten; i++) {
        for (var j = 0; j < reihen; j++) {
            netz[i][j].show();
        }  // um zu sehen, was die Zeilen beinhalten
    }
}

function gameOver() {
    for (var i = 0; i < spalten; i++) {
        for (var j = 0; j < reihen; j++) {
            netz[i][j].aufgeloest = true;
        }  // beim GameOver werden die Zeilen aufgeloest somit kann man nicht mehr damit interagieren

        var counterElement = document.getElementById("counter");
        counterElement.innerText = "Game Over";
    }  // Zeigt eine Game Over Message an, wenn eine Mine geklickt wird
}

function isGameOver() {
    for (var i = 0; i < spalten; i++) {
        for (var j = 0; j < reihen; j++) {
            var tile = netz[i][j];
            if (tile.mine && tile.aufgeloest) {
                return true; // Spiel wurde verloren
            }
        }
    }
    return false;  // Spiel wurde nicht verloren
}

function checkGameWon() {
    for (var i = 0; i < spalten; i++) {
        for (var j = 0; j < reihen; j++) {
            var tile = netz[i][j];
            if (!tile.mine && !tile.aufgeloest) {
                return false; // Spiel ist noch nicht gewonnen
            }
        }
    }
    return true; // Spiel ist gewonnen
}

function gameWon() {
    var counterElement = document.getElementById("counter");
    counterElement.innerText = "You Won!";
}

// Code für Zeilen

function Zeile(i, j, z) {  //Objekt für Zeilen
    this.x = i * z;
    this.y = j * z;
    this.z = z;
    this.i = i;
    this.j = j;
    this.nachbarAnzahl = 0;
    this.mine = false;
    this.aufgeloest = false;
    this.markiert = false;
}  // unter diesen Bedingungen sind alle Zeilen verdeckte, normale und unmarkierte Felder

Zeile.prototype.show = function() {
    stroke(0);
    noFill();
    rect(this.x, this.y, this.z, this.z);
    if (this.aufgeloest) {
        if (this.mine) {
            fill(10);
            square(this.x + this.z * 0.3, this.y + this.z * 0.3, this.z * 0.4);
        } else {
            fill(30);
            rect(this.x, this.y, this.z, this.z);
            if (this.nachbarAnzahl > 0) {
                textAlign(CENTER);
                fill(255);
                text(this.nachbarAnzahl, this.x + this.z*0.5, this.y + this.z - 5.5);
            }
        }
    } else if (this.markiert) {
        fill(200, 0, 0);
        rect(this.x, this.y, this.z, this.z);
    }
}

Zeile.prototype.beinhaltet = function(x, y) {
    return (x > this.x && x < this.x + this.z && y > this.y && y < this.y + this.z);
} //  das identifiziert, was genau als einzelne Zeile angesehen wird

Zeile.prototype.aufloesen = function() {
    this.aufgeloest = true;
    if (this.nachbarAnzahl === 0) {
        this.floodFill();
    }
} //  damit wird der Zeileninhalt veranschaulicht

Zeile.prototype.zaehleMinen = function() {
    if(this.mine) {
        this.nachbarAnzahl = -1;
        return;
    }  // bei Minen geschieht somit keine Berechnung der Nachbarn

    var gesamt = 0;
    for (var xversetzt = -1; xversetzt <= 1; xversetzt++) {
        for (var yversetzt = -1; yversetzt <= 1; yversetzt++) {
            var i = this.i + xversetzt;
            var j = this.j + yversetzt;
            if (i > -1 && i < spalten && j > -1 && j < reihen) {  // fuer den Fall, dass eine Zeile auswerts liegt
                var nachbarn = netz[i][j];
                if (nachbarn.mine) {
                    gesamt++;
                }  // untersucht die Versetzung von -1 und +1 der Zeile im Loop
            }
        }
    }
    this.nachbarAnzahl = gesamt;
}

Zeile.prototype.floodFill = function() {
    for (var xentfernt = -1; xentfernt <= 1; xentfernt++) {
        for (var yentfernt = -1; yentfernt <= 1; yentfernt++) {
            var i = this.i + xentfernt;
            var j = this.j + yentfernt;
            if (i > -1 && i < spalten && j > -1 && j < reihen) {
                var nachbar = netz[i][j];
                if (!nachbar.mine && !nachbar.aufgeloest) {
                    nachbar.aufloesen();
                }
            }
        }
    } // FloodFill bietet sich sehr fuer eine Kettenreaktion zur Aufdeckung leerer Zeilen an
}