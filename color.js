var gl;
var shaderProgram;
var uPMatrix;
var vertexPositionBuffer;
var vertexColorBuffer;

function startGL()
{
    let canvas = document.getElementById("canvas3D"); //wyszukanie obiektu w strukturze strony
    gl = canvas.getContext("experimental-webgl"); //pobranie kontekstu OpenGL'u z obiektu canvas
    gl.viewportWidth = canvas.width; //przypisanie wybranej przez nas rozdzielczości do systemu OpenGL
    gl.viewportHeight = canvas.height;

    //Kod shaderów
    const vertextShaderSource = ` //Znak akcentu z przycisku tyldy - na lewo od przycisku 1 na klawiaturze
    precision highp float;
    attribute vec3 aVertexPosition; 
    attribute vec3 aVertexColor;
    uniform mat4 zMVMatrix;
    uniform mat4 uPMatrix;
    varying vec3 vColor;
    void main(void) {
      gl_Position = uPMatrix * zMVMatrix * vec4(aVertexPosition, 1.0); //Dokonanie transformacji położenia punktów z przestrzeni 3D do przestrzeni obrazu (2D)
      vColor = aVertexColor;
    }
  `;
    const fragmentShaderSource = `
    precision highp float;
    varying vec3 vColor;
    void main(void) {
      gl_FragColor = vec4(vColor,1.0); //Ustalenie stałego koloru wszystkich punktów sceny
    }
  `;
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); //Stworzenie obiektu shadera
    let vertexShader   = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource); //Podpięcie źródła kodu shader
    gl.shaderSource(vertexShader, vertextShaderSource);
    gl.compileShader(fragmentShader); //Kompilacja kodu shader
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) { //Sprawdzenie ewentualnych błedów kompilacji
        alert(gl.getShaderInfoLog(fragmentShader));
        return null;
    }
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShader));
        return null;
    }

    shaderProgram = gl.createProgram(); //Stworzenie obiektu programu
    gl.attachShader(shaderProgram, vertexShader); //Podpięcie obu shaderów do naszego programu wykonywanego na karcie graficznej
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) alert("Could not initialise shaders");  //Sprawdzenie ewentualnych błedów

    //Opis sceny 3D, położenie punktów w przestrzeni 3D w formacie X,Y,Z
    let vertexPosition = [
        //Top
        -1.0, +1.0, -1.0,  -1.0, +1.0, +1.0,  +1.0, +1.0, +1.0, //3 punkty po 3 składowe - X1,Y1,Z1, X2,Y2,Z2, X3,Y3,Z3 - 1 trójkąt
        -1.0, +1.0, -1.0,  +1.0, +1.0, +1.0,  +1.0, +1.0, -1.0,
        //Left
        -1.0, -1.0, +1.0,  -1.0, +1.0, +1.0,  -1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,  -1.0, +1.0, +1.0,  -1.0, +1.0, -1.0,
        //Right
        +1.0, +1.0, +1.0,  +1.0, -1.0, +1.0,  +1.0, -1.0, -1.0,
        +1.0, +1.0, +1.0,  +1.0, -1.0, -1.0,  +1.0, +1.0, -1.0,
        //Front
        +1.0, -1.0, +1.0,  +1.0, +1.0, +1.0,  -1.0, -1.0, +1.0,
        -1.0, +1.0, +1.0,  -1.0, -1.0, +1.0,  +1.0, +1.0, +1.0,
        //Back
        +1.0, +1.0, -1.0,  +1.0, -1.0, -1.0,  -1.0, -1.0, -1.0,
        +1.0, +1.0, -1.0,  -1.0, -1.0, -1.0,  -1.0, +1.0, -1.0,
        //Bottom
        -1.0, -1.0, +1.0,  -1.0, -1.0, -1.0,  +1.0, -1.0, +1.0,
        +1.0, -1.0, +1.0,  -1.0, -1.0, -1.0,  +1.0, -1.0, -1.0
    ];

    vertexPositionBuffer = gl.createBuffer(); //Stworzenie tablicy w pamieci karty graficznej
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPosition), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3; //zdefiniowanie liczby współrzednych per wierzchołek
    vertexPositionBuffer.numItems = 12; //Zdefinoiowanie liczby punktów w naszym buforze

    //Opis sceny 3D, kolor każdego z wierzchołków
    let vertexColor = [
        //Top
        1.0, 1.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 0.0, //3 punkty po 3 składowe - R1,G1,B1, R2,G2,B2, R3,G3,B3 - 1 trójkąt
        1.0, 1.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 0.0,
        //Left
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,
        //Right
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,
        //Front
        0.0, 1.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 0.0,
        //Back
        1.0, 0.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0, 1.0,
        1.0, 0.0, 1.0,  1.0, 0.0, 1.0,  1.0, 0.0, 1.0,
        //Bottom
        0.0, 1.0, 1.0,  0.0, 1.0, 1.0,  0.0, 1.0, 1.0,
        0.0, 1.0, 1.0,  0.0, 1.0, 1.0,  0.0, 1.0, 1.0,
    ];

    vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColor), gl.STATIC_DRAW);
    vertexColorBuffer.itemSize = 3;
    vertexColorBuffer.numItems = 12;


    //Macierze opisujące położenie wirtualnej kamery w przestrzenie 3D
    let aspect = gl.viewportWidth/gl.viewportHeight;
    let fov = 45.0 * Math.PI / 180.0; //Określenie pola widzenia kamery
    let zFar = 100.0; //Ustalenie zakresów renderowania sceny 3D (od obiektu najbliższego zNear do najdalszego zFar)
    let zNear = 0.1;
    uPMatrix = [
        1.0/(aspect*Math.tan(fov/2)),0                           ,0                         ,0                            ,
        0                         ,1.0/(Math.tan(fov/2))         ,0                         ,0                            ,
        0                         ,0                           ,-(zFar+zNear)/(zFar-zNear)  , -1,
        0                         ,0                           ,-(2*zFar*zNear)/(zFar-zNear) ,0.0,
    ];
    Tick();
}
function MulMatrix(zMVMatrix,xMVMatrix,Matrix){
    Matrix[0] = zMVMatrix[0]*xMVMatrix[0] + zMVMatrix[4]*xMVMatrix[1] + zMVMatrix[8]*xMVMatrix[2];
    Matrix[1] = zMVMatrix[1]*xMVMatrix[0] + zMVMatrix[5]*xMVMatrix[1] + zMVMatrix[9]*xMVMatrix[2];
    Matrix[2] = zMVMatrix[2]*xMVMatrix[0] + zMVMatrix[6]*xMVMatrix[1] + zMVMatrix[10]*xMVMatrix[2];
    Matrix[4] = zMVMatrix[0]*xMVMatrix[4] + zMVMatrix[4]*xMVMatrix[5] + zMVMatrix[8]*xMVMatrix[6];
    Matrix[5] = zMVMatrix[1]*xMVMatrix[4] + zMVMatrix[5]*xMVMatrix[5] + zMVMatrix[9]*xMVMatrix[6];
    Matrix[6] = zMVMatrix[2]*xMVMatrix[4] + zMVMatrix[6]*xMVMatrix[5] + zMVMatrix[10]*xMVMatrix[6];
    Matrix[8] = zMVMatrix[0]*xMVMatrix[8] + zMVMatrix[4]*xMVMatrix[9] + zMVMatrix[8]*xMVMatrix[10];
    Matrix[9] = zMVMatrix[1]*xMVMatrix[8] + zMVMatrix[5]*xMVMatrix[9] + zMVMatrix[9]*xMVMatrix[10];
    Matrix[10] = zMVMatrix[2]*xMVMatrix[8] + zMVMatrix[6]*xMVMatrix[9] + zMVMatrix[10]*xMVMatrix[10];

    Matrix[3] = 0;
    Matrix[7] = 0;
    Matrix[11] = 0;
    Matrix[12] = 0;
    Matrix[13] = 0;
    Matrix[14] = -7;
    Matrix[15] = 1;
}
let angle = 45.0; //Macierz transformacji świata - określenie położenia kamery
function Tick()
{
    angle=angle+1;
    let zMVMatrix = [
        Math.cos(angle*Math.PI/180.0),-Math.sin(angle*Math.PI/180.0),0,0, //Macierz Rotacji
        Math.sin(angle*Math.PI/180.0),Math.cos(angle*Math.PI/180.0),0,0,
        0,0,1,0,
        0,0,-5,1 //Położenie kamery
    ];

    let xMVMatrix = [
        1,0,0,0,
        0,Math.cos(angle*Math.PI/180.0),-Math.sin(angle*Math.PI/180.0),0, //Macierz Rotacji
        0,Math.sin(angle*Math.PI/180.0),Math.cos(angle*Math.PI/180.0),0,
        0,0,-5,1 //Położenie kamery
    ];

    let Matrix=[];
    MulMatrix(zMVMatrix,xMVMatrix,Matrix);

    //alert(uPMatrix);

    //Render Scene
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(1.0,0.0,0.0,1.0); //Wyczyszczenie obrazu kolorem czerwonym
    gl.clearDepth(1.0);             //Wyczyścienie bufora głebi najdalszym planem
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(shaderProgram);   //Użycie przygotowanego programu shaderowego

    gl.enable(gl.DEPTH_TEST);           // Włączenie testu głębi - obiekty bliższe mają przykrywać obiekty dalsze
    gl.depthFunc(gl.LEQUAL);            //

    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uPMatrix"), false, new Float32Array(uPMatrix)); //Wgranie macierzy kamery do pamięci karty graficznej
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "zMVMatrix"), false, new Float32Array(zMVMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "xMVMatrix"), false, new Float32Array(xMVMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "Matrix"), false, new Float32Array(Matrix));

    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexPosition"));  //Przekazanie położenia
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexPosition"), vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexColor"));  //Przekazanie kolorów
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexColor"), vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numItems*vertexPositionBuffer.itemSize); //Faktyczne wywołanie rendrowania

    setTimeout(Tick,100);
}