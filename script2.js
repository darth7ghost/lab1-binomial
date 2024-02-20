function calcularDistribucionBinomial(){
    // Obtener los valores ingresados por el usuario
    const nValoresX = parseInt(document.getElementById('nValoresX').value);
    const probabilidadExito = parseFloat(document.getElementById('probabilidadExito').value);
    const numeroEventos = parseInt(document.getElementById('numeroEventos').value);
    const poblacionTotal = parseInt(document.getElementById('poblacionTotal').value);
    const maxTolerable = parseFloat(document.getElementById('maxTolerable').value);

    // Verificar si los valores son válidos
    if (isNaN(nValoresX) || isNaN(probabilidadExito) || isNaN(numeroEventos) || isNaN(poblacionTotal)) {
        alert('Por favor, ingrese valores numéricos válidos.');
        return;
    }
    // Mostrar el resultado en el elemento con id 'resultado'
    document.getElementById('rtitle').innerText = "Resultado:";

    const probabilidad = calcularProbabilidadBinomial(numeroEventos, probabilidadExito, nValoresX);
    document.getElementById('probabilidad').innerText = `Probabilidad: ${probabilidad.toFixed(4)}`;
    const media = calcularMediaBinomial(numeroEventos, probabilidadExito);
    document.getElementById('media').innerText = `Media: ${media.toFixed(4)}`;
    
    // Lógica para evaluar si la población es infinita
    const esPoblacionInfinita = evaluarPoblacionInfinita(numeroEventos, poblacionTotal);
    if (esPoblacionInfinita) {
        const desviacionEstandar = calcularDesviacionEstandarBinomial(numeroEventos, probabilidadExito);
        document.getElementById('desviacion').innerText = `Desviación estándar: ${desviacionEstandar.toFixed(4)}`;
    } else {
        const factor = factorCorreccion(numeroEventos, poblacionTotal);
        document.getElementById('factor').innerText = `Factor de correción: ${factor.toFixed(4)}`;
        const desviacionEstandar = calcularDesviacionEstandarBinomial(numeroEventos, probabilidadExito);
        let desviacionEstandarFinita = factor * desviacionEstandar;
        document.getElementById('desviacion').innerText = `Desviación estándar: ${desviacionEstandarFinita.toFixed(4)}`;
    }
    const sesgo = calcularSesgo(numeroEventos, probabilidadExito);
    document.getElementById('sesgo').innerText = `Sesgo: ${sesgo.toFixed(4)}`;
    const valorSesgo = evaluarSesgo(sesgo);
    document.getElementById('valorsesgo').innerText = `➥ Tipo de sesgo: ${valorSesgo}`;
    const curtosis = calcularCurtosis(numeroEventos, probabilidadExito);
    document.getElementById('curtosis').innerText = `Curtosis: ${curtosis.toFixed(4)}`;
    const valorCurtosis = evaluarCurtosis(curtosis);
    document.getElementById('valorcurtosis').innerText = `➥ Tipo de curtósis: ${valorCurtosis}`;

    const probabilidadAcumulada = [];
    const porcentaje = [];

    if(nValoresX === 0){
        document.getElementById('probabilidadxmayor').innerText = `➥ Probabilidad <X: ${probabilidad.toFixed(4)}`;
        const probabilidadXmin = 1 - probabilidad;
        document.getElementById('probabilidadxmin').innerText = `➥ Probabilidad >X: ${probabilidadXmin.toFixed(4)}`;
        document.getElementById('pxtitle').innerText = "Probabilidad binomial P(X):";
        document.getElementById('pacumuladatitle').innerText = "Probabilidad acumulada P(X):";
        //Tabla para probabilidad de P segun el numero de eventos.
        const resultados = calcularProbabilidadesBinomialesSinX(numeroEventos, probabilidadExito);
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
        const tablaBody = document.getElementById('tablaBody');
        // Asegúrate de que ambos arrays tengan la misma longitud
        if (resultados.length === probabilidadAcumulada.length) {
            // Recorre los arrays y agrega filas a la tabla
            for (let i = 0; i < resultados.length; i++) {
                const fila = document.createElement('tr');

                // Añade la celda de índice
                const celdaIndice = document.createElement('td');
                celdaIndice.textContent = i;
                fila.appendChild(celdaIndice);

                // Añade la celda de array1
                const celdaArray1 = document.createElement('td');
                celdaArray1.textContent = resultados[i];
                fila.appendChild(celdaArray1);

                // Añade la celda de array2
                const celdaArray2 = document.createElement('td');
                celdaArray2.textContent = probabilidadAcumulada[i];
                fila.appendChild(celdaArray2);

                // Añade la celda de porcentaje
                const celdaArray3 = document.createElement('td');
                celdaArray3.textContent = porcentaje[i];
                fila.appendChild(celdaArray3);

                // Agrega la fila a la tabla
                tablaBody.appendChild(fila);
            }
        } else {
            console.error('Los arrays no tienen la misma longitud');
        }
        //Grafica de probabilidad acumulada
        const ctx2 = document.getElementById('probabilidadAcumuladaChart').getContext('2d');
        const probabilidadAcumuladaChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Array.from({ length: numeroEventos + 1 }, (_, i) => i), // Etiquetas para cada valor de X
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
    } else {
        const probabilidadXmin = 1 - probabilidad;
        document.getElementById('probabilidadxmin').innerText = `➥ Probabilidad >X: ${probabilidadXmin.toFixed(4)}`;
        document.getElementById('pxtitle').innerText = "Probabilidad binomial P(X):";
        document.getElementById('pacumuladatitle').innerText = "Probabilidad acumulada P(X):";
        //Tabla para probabilidad de P segun el numero de valores de x.
        const resultados = calcularProbabilidadesBinomialesConX(numeroEventos, probabilidadExito, nValoresX);
        const ctx = document.getElementById('probabilidadBinomialChart').getContext('2d');
        const probabilidadBinomialChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({ length: nValoresX + 1 }, (_, i) => i), // Etiquetas para cada valor de X
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
        //Calculo de probabilidad de x maximo, x acumulada y el porcentaje
        let probabilidadXmayor = 0;
        for (var i = 0; i < resultados.length; i+=1) {
            probabilidadXmayor = probabilidadXmayor + resultados[i];
            let porcentajeTemp = probabilidadXmayor * 100;
            probabilidadAcumulada.push(probabilidadXmayor.toFixed(8));
            porcentaje.push(porcentajeTemp.toFixed(2));
        }
        //Tabla de probabilidades
        document.getElementById('probabilidadxmayor').innerText = `➥ Probabilidad <X: ${probabilidadXmayor.toFixed(4)}`;
        const tablaBody = document.getElementById('tablaBody');
        // Asegúrate de que ambos arrays tengan la misma longitud
        if (resultados.length === probabilidadAcumulada.length) {
            // Recorre los arrays y agrega filas a la tabla
            for (let i = 0; i < resultados.length; i++) {
                const fila = document.createElement('tr');

                // Añade la celda de índice
                const celdaIndice = document.createElement('td');
                celdaIndice.textContent = i;
                fila.appendChild(celdaIndice);

                // Añade la celda de P(X)
                const celdaArray1 = document.createElement('td');
                celdaArray1.textContent = resultados[i];
                fila.appendChild(celdaArray1);

                // Añade la celda de Probabilidad Acumulada
                const celdaArray2 = document.createElement('td');
                celdaArray2.textContent = probabilidadAcumulada[i];
                fila.appendChild(celdaArray2);

                // Añade la celda de porcentaje
                const celdaArray3 = document.createElement('td');
                celdaArray3.textContent = porcentaje[i];
                fila.appendChild(celdaArray3);

                // Agrega la fila a la tabla
                tablaBody.appendChild(fila);
            }
        } else {
            console.error('Los arrays no tienen la misma longitud');
        }
        //Grafica de probabilidad acumulada
        const ctx2 = document.getElementById('probabilidadAcumuladaChart').getContext('2d');
        const probabilidadAcumuladaChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Array.from({ length: nValoresX + 1 }, (_, i) => i), // Etiquetas para cada valor de X
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
    /**
     * Calcula la media de la distribución binomial para población infinita.
     */
    const media = n * p;
    return media;
}

function calcularDesviacionEstandarBinomial(n, p) {
    /**
     * Calcula la desviación estándar de la distribución binomial para población infinita.
     */
    const q = 1 - p;
    const desviacionEstandar = Math.sqrt(n * p * q);
    return desviacionEstandar;
}

function evaluarPoblacionInfinita(n, N) {
    /**
     * Evalúa si la población es infinita basándose en la proporción de la muestra con respecto a la población.
     */
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