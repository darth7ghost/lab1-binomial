function calcularDistribucionHipergeometrica(){
    // Obtener los valores ingresados por el usuario
    const nValoresX = parseInt(document.getElementById('nValoresX').value);
    const numeroEventos = parseInt(document.getElementById('numeroEventos').value);
    const exitosmin = parseInt(document.getElementById('exitosmin').value);
    const exitos = parseInt(document.getElementById('exitos').value);
    const poblacionTotal = parseInt(document.getElementById('poblacionTotal').value);

    reiniciarValores();

    if(evaluarPorcentajePoblacion(numeroEventos, poblacionTotal) === true){
        const probabilidad = calcularProbabilidadExitos(poblacionTotal, exitos);
        document.getElementById('pexitos').innerText = `Probabilidad de éxitos total: ${probabilidad.toFixed(4)}`;

        const probabilidadxd = calcularProbabilidad(exitos, numeroEventos, poblacionTotal, nValoresX);
        document.getElementById('pexitosX').innerText = `Probabilidad de éxitos para X valores: ${probabilidadxd.toFixed(4)}`;


        const media = calcularMediaBinomial(exitos, numeroEventos, poblacionTotal);
        document.getElementById('media').innerText = `Media: ${media.toFixed(4)}`;
        //------------ POISSON ----------------
        if(probabilidad < 0.10 && media < 10){
            probabilidadpoisson = calcularPoisson(media, numeroEventos);
            document.getElementById('probabilidadpoisson').innerText = `Probabilidad de Poisson para X valores: ${probabilidadpoisson.toFixed(4)}`;
            distribucionPoisson(media, numeroEventos);
        }
        //-------------------------------------
        calcularDesviacionEstandarBinomial(exitos, numeroEventos, poblacionTotal);
        calcularSesgo(exitos, numeroEventos, poblacionTotal);
        calcularCurtosis(exitos, numeroEventos, poblacionTotal);
        const resultados = probabilidadVisual(exitosmin, nValoresX, numeroEventos, poblacionTotal);
        grafica(exitosmin, nValoresX, resultados);
        tabla(exitosmin, nValoresX, resultados);
    } else {
        const probabilidad = calcularProbabilidadExitos(poblacionTotal, exitos);
        alert('Estos datos deben resolverse con probabilidad Binomial. Debe dirigirse al formulario de probabilidad binomial e introducir los valores:\nValores de inicio X: '
             + exitosmin + '\nValores X: ' + nValoresX + '\nProbabilidad: ' + probabilidad.toFixed(2) + '\nMuestra: ' + numeroEventos + '\nPoblación total: ' + poblacionTotal);
    }
}

function reiniciarValores(){
    document.getElementById('pexitos').append("");
    document.getElementById('pexitosX').append("");
    document.getElementById('media').append("");
    document.getElementById('desviacion').append("");
    document.getElementById('sesgo').append("");
    document.getElementById('valorsesgo').append("");
    document.getElementById('curtosis').append("");
    document.getElementById('valorcurtosis').append("");
}

function evaluarPorcentajePoblacion(numeroEventos, poblacionTotal){
    const porcentaje = 0.2 * poblacionTotal;

    if (numeroEventos >= porcentaje) {
        return true;
    } else {
        return false;
    }
}

function calcularProbabilidadExitos(N, T){
    const probabilidad = T / N;
    return probabilidad;
}

function calcularProbabilidadBinomial(N, p, x) {
    const q = 1 - p;
    return comb(N, x) * Math.pow(p, x) * Math.pow(q, N - x);
}

function calcularMediaBinomial(k, n, N){
    const media = (n * k) / N;
    return media;
}

function calcularDesviacionEstandarBinomial(k, n, N){ //REVISAR, 8, 30, 100, debe dar 2.44948974. AGREGAR K
    const f1 = k / N;
    const f2 = (N - k) / N;
    const f3 = (N - n) / (N - 1);
    const media = (n * k) / N;
    const desviacion = Math.sqrt(media);
    document.getElementById('desviacion').innerText = `Desviación estándar: ${desviacion.toFixed(4)}`;
}

function calcularSesgo(k, n, N){
    const f1 = (N - 2*k) * Math.pow(N - 1, 0.5) * (N - 2*n);
    const f2 = Math.pow(n * k * (N - k) * (N - n), 0.5) * (N - 2);
    const sesgo = f1 / f2;
    document.getElementById('sesgo').innerText = `Sesgo: ${sesgo.toFixed(4)}`;
    var valor;
    if(sesgo === 0){
        valor = 'sesgo neutral.';
    }else if(sesgo < 0){
        valor = 'sesgo negativo.';
    } else if (sesgo > 0){
        valor = 'sesgo positivo.';
    }
    document.getElementById('valorsesgo').innerText = `➥ Tipo de sesgo: ${valor}`;
}

function calcularCurtosis(k, n, N){
    const f1d1 = Math.pow(N, 2) * (N - 1);
    const f2d1 = n * (N - 2) * (N - 3) * (N - n);
    const d1 = f1d1 / f2d1;

    const f1d2 = N * (N + 1) - 6 * N * (N - n);
    const f2d2 = n * (N - n);
    const d2 = f1d2 / f2d2;

    const f1d3 = 3 * n * (N - n) * (N + 6);
    const d3 = (f1d3 / Math.pow(N, 2)) - 6;

    const curtosis = d1 * (d2 + d3);
    document.getElementById('curtosis').innerText = `Curtosis: ${curtosis.toFixed(4)}`;

    var valor;
    if(curtosis === 0){
        valor = 'curva mesocúrtita (campana de Gauss).';
    }else if(curtosis < 0){
        valor = 'curva platicúrtica.';
    } else if (curtosis > 0){
        valor = 'curva leptocúrtica.';
    }
    document.getElementById('valorcurtosis').innerText = `➥ Tipo de curtósis: ${valor}`;
}

function calcularProbabilidad(k, n, N, x){
    const f1 = comb(k, x) * comb(N - k, n - x);
    const f2 = comb(N, n);
    return f1 / f2;
}

function probabilidadVisual(exitosmin, nValoresX, numeroEventos, poblacionTotal){
    let nval= 0;
    if(isNaN(exitosmin)){
        nval = 0;
    } else {
        nval = exitosmin;
    }
    const resultados = [];
    for (let x = nval; x <= nValoresX; x++) {
        if(x >= nval){
            resultados.push(calcularProbabilidad(nValoresX, numeroEventos, poblacionTotal, x));
        }
    }
    return resultados;
}

function comb(N, k) {
    // Función para calcular combinación (N, k)
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (N - i + 1) / i;
    }
    return result;
}

function grafica(exitosmin, nValoresX, resultados){
    let nval= 0;
    if(isNaN(exitosmin)){
        nval = 0;
    } else {
        nval = exitosmin;
    }
    document.getElementById('gtitle').innerText = "Gráfica de probabilidad X:";
    const ctx = document.getElementById('probabilidadChart').getContext('2d');
    const probabilidadChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: nValoresX - nval + 1 }, (_, i) => i + nval), // Etiquetas para cada valor de X
            datasets: [{
                label: 'Probabilidad de X',
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

function tabla(exitosmin, nValoresX, listaClientes){
    let nval= 0;
    const numerosX = [];
    if(isNaN(exitosmin)){
        nval = 0;
    } else {
        nval = exitosmin;
    }
    for (let x = 0; x <= nValoresX; x++) {
        if(x >= nval){
            numerosX.push(x);
        }
    }
    document.getElementById('ttitle').innerText = "Tabla de probabilidad X:";
    const tablaBody = document.getElementById('tablaBody');
    // Recorre los arrays y agrega filas a la tabla
    for (let i = 0; i < listaClientes.length; i++) {
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
        celdaArray1.textContent = listaClientes[i];
        fila.appendChild(celdaArray1);
        // Agrega la fila a la tabla
        tablaBody.appendChild(fila);
    }
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
function distribucionPoisson(media, k){
    const listaPoisson = [];
    for (let x = 0; x <= k; x++) {
        listaPoisson.push(calcularPoisson(media, x));
    }
    tablaPoisson(listaPoisson, k);
    graficaPoisson(listaPoisson, k);
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
                        const t = p * totalEventos * numEventosSimilares;
                        document.getElementById('exitos').value = t.toFixed(2); // Redondear a dos decimales
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