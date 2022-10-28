let divTrivia
let Contador = 0;
let puntos = 0;
let pregAbierta  = false;
let pp;

class Preguntas{
    columna1 = [];
    columna2 = [];
    columna3 = [];

    category = [10,20,30];
    difficulty = ["easy","medium","hard"];
    points = {easy:100,medium:200,hard:300};

    constructor(){
        this.columna1 = new Array;
        this.columna2 = new Array;
        this.columna3 = new Array;
    }

    AgregaValor = function(indice, valor){
        eval("this.columna" + indice + "").push(valor);
        return eval("this.columna" + indice + ".length");
    }
    retornaValor = function(indice){
        return eval("this.columna" + indice + "")
    }
    traeRespCorrecta = function(indice, pregunta){
        return eval("this.columna" + indice + "[" + pregunta + "].results[0].correct_answer")
    }
    traeDifficulty = function(indice,pregunta){
        return eval("this.columna" + indice + "[" + pregunta + "].results[0].difficulty")
    }
}

async function postData(url) {
    const response = await fetch(url);
    return response.json();
}
const Buscar = () => {
    pp = new Preguntas;

    Contador = 0;
    let puntos = 0;
    pregAbierta  = false;
    
    for (let l=0 ; l<pp.category.length ; l++){
        for (let z=0 ; z<pp.difficulty.length ; z++){

            postData("https://opentdb.com/api.php?amount=1&difficulty=" + pp.difficulty[z] + "&category=" + pp.category[l])
            .then((param) =>{
                let largo = pp.AgregaValor((l+1), param);
                if (largo === 3){
                    procesaPreguntas((l+1), pp.retornaValor((l+1)));
                }       
            })
            .catch((error)=>{})
            .finally(() => {});

        }
    }
}

let link = document.querySelector("a")
link.addEventListener("click",Buscar)
Buscar();

function procesaPreguntas(columna, data){
    divTrivia = document.querySelector(".columna" + columna);

    let Headers = "";
    let easy = "";
    let medium = "";
    let hard = "";

    for (let i=0; i<data.length; i++) {
        Contador++;
        let trivia = "";
        if (data[i].response_code === 0){
            if (i === 0) {
                Headers = "<p>" + data[i].results[0].category + "</p>";
            }
            let puntos = eval("pp.points." + data[i].results[0].difficulty);

            trivia += "<div class='border " + Contador + "'>";
            trivia += "<button class='mostrar' onClick='muestra(this)'>" + puntos + "</button>";
            trivia += "<ul class='ocultar'>";
            trivia += "<li>";
            trivia += data[i].results[0].question;   
            trivia += "[" + data[i].results[0].difficulty + "]";
            trivia += "</li>";
            let posicion = Math.floor(Math.random() * data[i].results[0].incorrect_answers.length)
            let Indice = 0;
            for (let k=0; k<data[i].results[0].incorrect_answers.length; k++) {
                if (k == posicion){
                    Indice ++;
                    trivia += "<li>";
                    trivia += "<input type='radio' name='Pregunta_" + Contador + "' id='Respuesta_" + Contador + "_" + Indice + "' onclick='validacion(" + Contador + "," + Indice + "," + columna + "," + i + ")'>"
                    trivia += "<label for='Respuesta_" + Contador + "_" + Indice + "'>"
                    trivia += data[i].results[0].correct_answer;    
                    trivia += "</label>";
                    trivia += "</li>";
                } 
                Indice ++;
                trivia += "<li>";
                trivia += "<input type='radio' name='Pregunta_" + Contador + "' id='Respuesta_" + Contador + "_" + Indice + "' onclick='validacion(" + Contador + "," + Indice + "," + columna + "," + i + ")'>"
                trivia += "<label for='Respuesta_" + Contador + "_" + Indice + "'>"
                trivia += data[i].results[0].incorrect_answers[k];  
                trivia += "</label>";
                trivia += "</li>";
            }
            trivia += "</ul>";
            trivia += "</div>";
        } else {
            console.log("ERROR")
        }

        eval(data[i].results[0].difficulty + " = trivia");
    }
    divTrivia.innerHTML = Headers + easy + medium + hard
}

function validacion(caja, preg, columna, resp){
    let div  = document.querySelector("div[class='border " + caja + "']");
    console.log(div.innerHTML);

    let label  = document.querySelector("label[for='Respuesta_" + caja + "_" + preg + "']");
    
    let Nivel = "";
    if (pp.traeRespCorrecta(columna, resp) == label.innerHTML){
        Nivel =pp.traeDifficulty(columna, resp)
        div.innerHTML="Respuesta Correcta<br>" + pp.traeRespCorrecta(columna, resp) + ""
        div.classList.add("colorOK")
    } else {
        div.innerHTML="Respuesta Incorrecta<br>" + pp.traeRespCorrecta(columna, resp) + ""
        div.classList.add("colorNOK")
    }

    if (Nivel === 'easy'){
        puntos += 100;
    } else if (Nivel === 'medium'){
        puntos += 200;
    }else if (Nivel === 'hard'){
        puntos += 300;
    }
    document.querySelector(".puntos").innerHTML = puntos + " points";
    pregAbierta = false;
}

function muestra(e){
    if (pregAbierta === false){
        e.classList.replace("mostrar","ocultar");
        e.nextElementSibling.classList.replace("ocultar","mostrar");
        pregAbierta = true
    }
    
}