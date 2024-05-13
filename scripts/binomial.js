function calcularDistribucionBinomial(){
    // Obtener los valores ingresados por el usuario
    const nValoresXmin = parseInt(document.getElementById('nValoresXmin').value);
    const nValoresX = parseInt(document.getElementById('nValoresX').value);
    const probabilidadExito = parseFloat(document.getElementById('probabilidadExito').value);
    const numeroEventos = parseInt(document.getElementById('numeroEventos').value);
    const poblacionTotal = parseInt(document.getElementById('poblacionTotal').value);
    const maxTolerable = parseFloat(document.getElementById('maxTolerable').value);

    reiniciarValores();

    // Mostrar el resultado en el elemento con id 'resultado'
    document.getElementById('rtitle').innerText = "Resultado:";

    //Solucion probabilidad binomial
    // Lógica para evaluar si la población es infinita
    const esPoblacionInfinita = evaluarPoblacionInfinita(numeroEventos, poblacionTotal);
    if (esPoblacionInfinita === true) {
        solucionBinomialInfinita(nValoresXmin, nValoresX, probabilidadExito, numeroEventos, poblacionTotal, maxTolerable);
    } else {
        if(evaluarPorcentajePoblacion(numeroEventos, poblacionTotal) === true){
            const probabilidad = calcularProbabilidadBinomial(numeroEventos, probabilidadExito, nValoresX);
            const nt = probabilidad * poblacionTotal;
            alert('Estos datos deben resolverse con probabilidad Hipergeométrica. Debe dirigirse al formulario de probabilidad hipergeométrica e introducir los valores:\nValores de inicio X: '
             + nValoresXmin + '\nValores X: ' + nValoresX + '\nMuestra: ' + numeroEventos + '\nNumero de éxitos T: ' + nt.toFixed(2) + '\nPoblación total: ' + poblacionTotal);
        } else {
            solucionBinomialFinita(nValoresXmin, nValoresX, probabilidadExito, numeroEventos, poblacionTotal, maxTolerable);
        }
    }
}

function reiniciarValores(){
    document.getElementById('probabilidad').append("");
    document.getElementById('probabilidadxmayor').append("");
    document.getElementById('probabilidadxmin').append("");
    document.getElementById('media').append("");
    document.getElementById('factor').append("");
    document.getElementById('desviacion').append("");
    document.getElementById('sesgo').append("");
    document.getElementById('valorsesgo').append("");
    document.getElementById('curtosis').append("");
    document.getElementById('valorcurtosis').append("");
    document.getElementById('valorTolerable').append("");
    document.getElementById('avisoK').append("");
}

function evaluarPorcentajePoblacion(numeroEventos, poblacionTotal){
    const porcentaje = 0.2 * poblacionTotal;

    if (numeroEventos >= porcentaje) {
        return true;
    } else {
        return false;
    }
}

function solucionBinomialInfinita(nValoresXmin, nValoresX, probabilidadExito, numeroEventos, poblacionTotal, maxTolerable){
    const probabilidad = calcularProbabilidadBinomial(numeroEventos, probabilidadExito, nValoresX);
    document.getElementById('probabilidad').innerText = `Probabilidad: ${probabilidad.toFixed(8)}`;
    const media = calcularMediaBinomial(numeroEventos, probabilidadExito);
    document.getElementById('media').innerText = `Media: ${media.toFixed(4)}`;
    //------------ POISSON ----------------
    if(probabilidad < 0.10 && media < 10){
        probabilidadpoisson = calcularPoisson(media, nValoresX);
        document.getElementById('probabilidadpoisson').innerText = `Probabilidad de Poisson para X valores: ${probabilidadpoisson.toFixed(8)}`;
        distribucionPoisson(media, nValoresXmin, nValoresX);
    }
    //------------ POISSON ----------------
    const desviacionEstandar = calcularDesviacionEstandarBinomial(numeroEventos, probabilidadExito);
    document.getElementById('desviacion').innerText = `Desviación estándar: ${desviacionEstandar.toFixed(8)}`;
    sesgoCurtosis(numeroEventos, probabilidadExito);
    if(nValoresX === 0){
        noExisteX(probabilidad, probabilidadExito, numeroEventos, maxTolerable);
    } else {
        existeX(probabilidad, probabilidadExito, numeroEventos, nValoresXmin, nValoresX, maxTolerable);
    }
}

function solucionBinomialFinita(nValoresXmin, nValoresX, probabilidadExito, numeroEventos, poblacionTotal, maxTolerable){
    const probabilidad = calcularProbabilidadBinomial(numeroEventos, probabilidadExito, nValoresX);
    document.getElementById('probabilidad').innerText = `Probabilidad: ${probabilidad.toFixed(8)}`;
    const media = calcularMediaBinomial(numeroEventos, probabilidadExito);
    document.getElementById('media').innerText = `Media: ${media.toFixed(4)}`;
    //------------ POISSON ----------------
    if(probabilidad < 0.10 && media < 10){
        probabilidadpoisson = calcularPoisson(media, nValoresX);
        document.getElementById('probabilidadpoisson').innerText = `Probabilidad de Poisson para X valores: ${probabilidadpoisson.toFixed(8)}`;
        distribucionPoisson(media, nValoresXmin, nValoresX);
    }
    //-------------------------------------
    const factor = factorCorreccion(numeroEventos, poblacionTotal);
    document.getElementById('factor').innerText = `Factor de correción: ${factor.toFixed(4)}`;
    const desviacionEstandar = calcularDesviacionEstandarBinomial(numeroEventos, probabilidadExito);
    let desviacionEstandarFinita = factor * desviacionEstandar;
    document.getElementById('desviacion').innerText = `Desviación estándar: ${desviacionEstandarFinita.toFixed(4)}`;
    sesgoCurtosis(numeroEventos, probabilidadExito);
    if(nValoresX === 0){
        noExisteX(probabilidad, probabilidadExito, numeroEventos, maxTolerable);
    } else {
        existeX(probabilidad, probabilidadExito, numeroEventos, nValoresXmin, nValoresX, maxTolerable);
    }
}

function sesgoCurtosis(numeroEventos, probabilidadExito){
    const sesgo = calcularSesgo(numeroEventos, probabilidadExito);
    document.getElementById('sesgo').innerText = `Sesgo: ${sesgo.toFixed(4)}`;
    const valorSesgo = evaluarSesgo(sesgo);
    document.getElementById('valorsesgo').innerText = `➥ Tipo de sesgo: ${valorSesgo}`;
    const curtosis = calcularCurtosis(numeroEventos, probabilidadExito);
    document.getElementById('curtosis').innerText = `Curtosis: ${curtosis.toFixed(4)}`;
    const valorCurtosis = evaluarCurtosis(curtosis);
    document.getElementById('valorcurtosis').innerText = `➥ Tipo de curtósis: ${valorCurtosis}`;
}

function existeX(probabilidad, probabilidadExito, numeroEventos, nValoresXmin, nValoresX, maxTolerable){
    const probabilidadAcumulada = [];
    const porcentaje = [];
    const numerosX = [];
    const nresultados = [];
    const probabilidadXmin = 1 - probabilidad;
    document.getElementById('probabilidadxmin').innerText = `➥ Probabilidad >X: ${probabilidadXmin.toFixed(8)}`;
    document.getElementById('pxtitle').innerText = "Probabilidad P(X):";
    document.getElementById('pacumuladatitle').innerText = "Probabilidad acumulada P(X):";
    //Tabla para probabilidad de P segun el numero de valores de x.
    const resultados = calcularProbabilidadesBinomialesConX(numeroEventos, probabilidadExito, nValoresX);
    graficaBinomialConX(nValoresXmin, nValoresX, resultados);
    //Calculo de probabilidad de x maximo, x acumulada y el porcentaje
    let probabilidadXmayor = 0;
    let nval= 0;
    if(isNaN(nValoresXmin)){
        nval = 0;
    } else {
        nval = nValoresXmin;
    }
    for (var i = 0; i <= nValoresX; i++) {
        probabilidadXmayor = probabilidadXmayor + resultados[i];
        let porcentajeTemp = probabilidadXmayor * 100;
        if(i >= nval){
            probabilidadAcumulada.push(probabilidadXmayor.toFixed(8));
            porcentaje.push(porcentajeTemp.toFixed(2));
            numerosX.push(i);
            nresultados.push(resultados[i]);
        }
    }

    //Tabla de probabilidades
    document.getElementById('probabilidadxmayor').innerText = `➥ Probabilidad <X: ${probabilidadXmayor.toFixed(8)}`;
    document.getElementById('tbtitle').innerText = "Tabla de probabilidad acumulada:";
    tablaProbabilidadAcumulada(numerosX, nresultados, probabilidadAcumulada, porcentaje);
    //Grafica de probabilidad acumulada
    graficaProbabilidadAcumulada(nValoresXmin, nValoresX, probabilidadAcumulada);

    let indiceSolucion = 0;
    let indicadorSolucion = 0;
    if(maxTolerable > 0){
        for (let x = 0; x <= probabilidadAcumulada.length; x++) {
            if(probabilidadAcumulada[x] <= maxTolerable && indicadorSolucion != 1){
                indiceSolucion = x;
                console.log(indiceSolucion);
            } else {
                indicadorSolucion = 1;
            }
        }
        document.getElementById('valorTolerable').innerText = `Para un porcentaje tolerable de [${maxTolerable*100}%], se necesita un máximo de [${indiceSolucion}] unidades en muestra.`;
    }
}

function noExisteX(probabilidad, probabilidadExito, numeroEventos, maxTolerable){
    const probabilidadAcumulada = [];
    const porcentaje = [];
    document.getElementById('probabilidadxmayor').innerText = `➥ Probabilidad <X: ${probabilidad.toFixed(4)}`;
    const probabilidadXmin = 1 - probabilidad;
    document.getElementById('probabilidadxmin').innerText = `➥ Probabilidad >X: ${probabilidadXmin.toFixed(4)}`;
    document.getElementById('pxtitle').innerText = "Probabilidad P(X):";
    document.getElementById('pacumuladatitle').innerText = "Probabilidad acumulada P(X):";
    //Tabla para probabilidad de P segun el numero de eventos.
    const resultados = calcularProbabilidadesBinomialesSinX(numeroEventos, probabilidadExito);
    graficaBinomialSinX(numeroEventos, resultados);
    //Calculo de probabilidad de x acumulada y el porcentaje
    let probabilidadXmayor = 0;
    for (var i = 0; i < resultados.length; i+=1) {
        probabilidadXmayor = probabilidadXmayor + resultados[i];
        let porcentajeTemp = probabilidadXmayor * 100;
        probabilidadAcumulada.push(probabilidadXmayor.toFixed(8));
        porcentaje.push(porcentajeTemp.toFixed(2));
    }
    //Tabla de probabilidades
    document.getElementById('probabilidadxmayor').innerText = `➥ Probabilidad <X: ${probabilidadXmayor.toFixed(4)}`;
    tablaProbabilidadAcumulada(resultados, probabilidadAcumulada, porcentaje);
    
    //Grafica de probabilidad acumulada
    graficaProbabilidadAcumulada(numeroEventos, probabilidadAcumulada);

    let indiceSolucion = 0;
    let indicadorSolucion = 0;
    if(maxTolerable > 0){
        for (let x = 0; x <= probabilidadAcumulada.length; x++) {
            if(probabilidadAcumulada[x] <= maxTolerable && indicadorSolucion != 1){
                indiceSolucion = x;
                console.log(indiceSolucion);
            } else {
                indicadorSolucion = 1;
            }
        }
        document.getElementById('valorTolerable').innerText = `Para un porcentaje tolerable de [${maxTolerable*100}%], se necesita un máximo de [${indiceSolucion}] unidades en muestra.`;
    }
}

// Solicita los valores de probabilidad cuando haya 1 o mas valores de X
function calcularProbabilidadesBinomialesConX(n, p, nValoresX) {
    const resultados = [];
    for (let x = 0; x <= nValoresX; x++) {
        resultados.push(calcularProbabilidadBinomial(n, p, x));
    }
    return resultados;
}

function calcularProbabilidadBinomial(N, p, x) {
    const q = 1 - p;
    return comb(N, x) * Math.pow(p, x) * Math.pow(q, N - x);
}

// Solicita los valores de probabilidad cuando no hayan valores de X
function calcularProbabilidadesBinomialesSinX(numeroEventos, p) {
    const resultados = [];
    for (let x = 0; x <= numeroEventos; x++) {
        resultados.push(calcularProbabilidadBinomial(numeroEventos, p, x));
    }
    return resultados;
}

function calcularMediaBinomial(n, p) {
    const media = n * p;
    return media;
}

function calcularDesviacionEstandarBinomial(n, p) {
    const q = 1 - p;
    const desviacionEstandar = Math.sqrt(n * p * q);
    return desviacionEstandar;
}

function evaluarPoblacionInfinita(n, N) {
    const proporcionMuestra = n / N;
    if (proporcionMuestra <= 0.05 || N === 0) {
        return true; // Población infinita
    } else {
        return false; // Población finita
    }
}

function comb(N, k) {
    // Función para calcular combinación (N, k)
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (N - i + 1) / i;
    }
    return result;
}

// Función para factor de corrección
function factorCorreccion(n, N){
    const frac1 = N - n;
    const frac2 = N - 1;
    return factor = Math.sqrt(frac1/frac2);
}

// Función para calcular sesgo.
function calcularSesgo(n, p){
    const q = 1 - p;
    const frac1 = q - p;
    const frac2 = Math.sqrt(n * p * q);
    return frac1 / frac2;
}

function evaluarSesgo(sesgo){
    var valor;
    if(sesgo === 0){
        valor = 'sesgo neutral.';
    }else if(sesgo < 0){
        valor = 'sesgo negativo.';
    } else if (sesgo > 0){
        valor = 'sesgo positivo.';
    }
    return valor;
}

// Función para calcular curtosis.
function calcularCurtosis(n, p){
    const q = 1 - p;
    const frac1 = 1 - (6 * p * q);
    const frac2 = Math.sqrt(n * p * q);
    return 3 + (frac1/frac2);
}

function evaluarCurtosis(curtosis){
    var valor;
    if(curtosis === 0){
        valor = 'curva mesocúrtita (campana de Gauss).';
    }else if(curtosis < 0){
        valor = 'curva platicúrtica.';
    } else if (curtosis > 0){
        valor = 'curva leptocúrtica.';
    }
    return valor;
}

function graficaBinomialSinX(numeroEventos, resultados){
	const ctx = document.getElementById('probabilidadBinomialChart').getContext('2d');
    const probabilidadBinomialChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: numeroEventos + 1 }, (_, i) => i),
            datasets: [{
                label: 'Probabilidad Binomial',
                data: resultados,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function graficaBinomialConX(nValoresXmin, nValoresX, resultados){
    let  nval= 0;
    if(isNaN(nValoresXmin)){
        nval = 0;
    } else {
        nval = nValoresXmin;
    }
    const ctx = document.getElementById('probabilidadBinomialChart').getContext('2d');
    const probabilidadBinomialChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: nValoresX - nval + 1 }, (_, i) => i + nval), // Etiquetas para cada valor de X
            datasets: [{
                label: 'Probabilidad Binomial',
                data: resultados,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo de las barras
                borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
                borderWidth: 1, // Ancho del borde de las barras
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function tablaProbabilidadAcumulada(numerosX, resultados, probabilidadAcumulada, porcentaje){
    const tablaBody = document.getElementById('tablaBody');
    if (resultados.length === probabilidadAcumulada.length) {
        let j = 0;
        // Recorre los arrays y agrega filas a la tabla
        for (let i = 1; i <= resultados.length; i++) {
            const fila = document.createElement('tr');
            // Añade la celda de índice
            const celdaIndice = document.createElement('td');
            celdaIndice.textContent = i;
            fila.appendChild(celdaIndice);
            // Añade la celda de array1
            const celdaArrayX = document.createElement('td');
            celdaArrayX.textContent = numerosX[j];
            fila.appendChild(celdaArrayX);
            // Añade la celda de array1
            const celdaArray1 = document.createElement('td');
            celdaArray1.textContent = resultados[j];
            fila.appendChild(celdaArray1);
            // Añade la celda de array2
            const celdaArray2 = document.createElement('td');
            celdaArray2.textContent = probabilidadAcumulada[j];
            fila.appendChild(celdaArray2);
            // Añade la celda de porcentaje
            const celdaArray3 = document.createElement('td');
            celdaArray3.textContent = porcentaje[j];
            fila.appendChild(celdaArray3);
            // Agrega la fila a la tabla
            tablaBody.appendChild(fila);
            j = j + 1;
        }
    } else {
        console.error('Los arrays no tienen la misma longitud');
    }
}

function graficaProbabilidadAcumulada(nValoresXmin, numeroEventos, probabilidadAcumulada){
    let  nval= 0;
    if(isNaN(nValoresXmin)){
        nval = 0;
    } else {
        nval = nValoresXmin;
    }
    const ctx2 = document.getElementById('probabilidadAcumuladaChart').getContext('2d');
    const probabilidadAcumuladaChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: Array.from({ length: numeroEventos - nval + 1 }, (_, i) => i + nval), // Etiquetas para cada valor de X
            datasets: [{
                label: 'Probabilidad Binomial',
                data: probabilidadAcumulada,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo de las barras
                borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
                borderWidth: 1, // Ancho del borde de las barras
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/*
/ PROBABILIDAD DE POISSON
*/
function calcularPoisson(media, k) {
    // Calcular e^(-λ)
    const parte1 = Math.exp(-media);
    // Calcular λ^k / k!
    const parte2 = Math.pow(media, k) / factorial(k);
    // Calcular la probabilidad de Poisson
    const probabilidad = parte1 * parte2;
    return probabilidad;
}

// Función para calcular el factorial de un número
function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

//Lista de valores de probabilidad de Poisson segun numero de exitos
function distribucionPoisson(media, nValoresXmin, k){
    const listaPoisson = [];
    const numerosX = [];
    let nval= 0;
    if(isNaN(nValoresXmin)){
        nval = 0;
    } else {
        nval = nValoresXmin;
    }
    for (let x = 0; x <= k; x++) {
        if(x >= nval){
            listaPoisson.push(calcularPoisson(media, x));
            numerosX.push(x);
        }
    }
    tablaPoisson(listaPoisson, numerosX);
    graficaPoisson(listaPoisson, nval, k);
}

//Tabla de Poisson
function tablaPoisson(listaPoisson, numerosX){
    document.getElementById('tptitle').innerText = "Tabla de distribución de Poisson:";
    const tablaPoissonBody = document.getElementById('tablaPoissonBody');
    // Recorre los arrays y agrega filas a la tabla
    for (let i = 0; i < listaPoisson.length; i++) {
        const fila = document.createElement('tr');
        // Añade la celda de índice
        const celdaIndice = document.createElement('td');
        celdaIndice.textContent = i;
        fila.appendChild(celdaIndice);
        // Añade la celda de array1
        const celdaArrayX = document.createElement('td');
        celdaArrayX.textContent = numerosX[i];
        fila.appendChild(celdaArrayX);
        // Añade la celda de array1
        const celdaArray1 = document.createElement('td');
        celdaArray1.textContent = listaPoisson[i];
        fila.appendChild(celdaArray1);
        // Agrega la fila a la tabla
        tablaPoissonBody.appendChild(fila);
    }
}

function graficaPoisson(listaPoisson, nValoresXmin, nValoresX){
    document.getElementById('ppoissontitle').innerText = "Gráfica de distribución de Poisson:";
    const ctx = document.getElementById('distribucionPoissonChart').getContext('2d');
    const distribucionPoissonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: nValoresX - nValoresXmin + 1 }, (_, i) => i + nValoresXmin), // Etiquetas para cada valor de X
            datasets: [{
                label: 'Distribución de Poisson',
                data: listaPoisson,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo de las barras
                borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
                borderWidth: 1, // Ancho del borde de las barras
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function loadJSONFile(file, callback) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const jsonData = JSON.parse(event.target.result);
        callback(jsonData);
    };

    reader.readAsText(file);
}

let simulacionFile;

document.addEventListener('DOMContentLoaded', function() {
    // Escuchar el evento de cambio en los elementos de entrada de archivo
    document.getElementById('inventarioInput').addEventListener('change', function(event) {
        const file = event.target.files[0];

        // Verificar si el archivo cargado es el inventario.json
        if (file.name === 'inventario.json') {
            loadJSONFile(file, function(inventario) {
                // Crear el desplegable con los objetos del inventario
                const selectElement = document.createElement('select');
                inventario.forEach(producto => {
                    const option = document.createElement('option');
                    option.text = producto.nombre;
                    selectElement.appendChild(option);
                });

                // Agregar el desplegable al contenedor en el HTML
                const selectContainer = document.getElementById('selectContainer');
                selectContainer.innerHTML = ''; // Limpiar el contenedor
                selectContainer.appendChild(selectElement);

                // Escuchar el evento de cambio en el desplegable
                selectElement.addEventListener('change', function() {
                    const selectedProduct = inventario.find(producto => producto.nombre === selectElement.value);

                    // Verificar si se ha cargado el archivo simulacion.json
                    if (simulacionFile) {
                        // Leer el archivo simulacion.json para contar cuántos objetos posee
                        const totalEventos = simulacionFile.length;
                        document.getElementById('poblacionTotal').value = totalEventos;

                        // Contar cuántos artículos existen en simulacion.json que sean iguales al seleccionado
                        const numEventosSimilares = simulacionFile.filter(item => item.nombre === selectedProduct.nombre).length;
                        document.getElementById('numeroEventos').value = numEventosSimilares;

                        // Calcular la probabilidad de éxito (p)
                        const p = numEventosSimilares / totalEventos;
                        document.getElementById('probabilidadExito').value = p.toFixed(2); // Redondear a dos decimales
                    } else {
                        console.error('El archivo simulacion.json no se ha cargado.');
                    }
                });
            });
        }
    });

    // Escuchar el evento de cambio para el otro archivo .json (simulacion.json)
    document.getElementById('simulacionInput').addEventListener('change', function(event) {
        // Leer el archivo simulacion.json
        const file = event.target.files[0];
        loadJSONFile(file, function(simulacion) {
            // Guardar el archivo simulacion.json para acceder a él cuando se seleccione un producto del inventario
            simulacionFile = simulacion;
        });
    });
});