function calcularDistribucionBinomial() {
    // Obtener los valores ingresados por el usuario
    const nValoresX = parseInt(document.getElementById('nValoresX').value);
    const probabilidadExito = parseFloat(document.getElementById('probabilidadExito').value);
    const numeroEventos = parseInt(document.getElementById('numeroEventos').value);
    const poblacionTotal = parseInt(document.getElementById('poblacionTotal').value);

    // Verificar si los valores son válidos
    if (isNaN(nValoresX) || isNaN(probabilidadExito) || isNaN(numeroEventos) || isNaN(poblacionTotal)) {
        alert('Por favor, ingrese valores numéricos válidos.');
        return;
    }

    // Lógica para evaluar si la población es infinita
    const esPoblacionInfinita = evaluarPoblacionInfinita(numeroEventos, poblacionTotal);

    // Lógica para calcular la probabilidad, media y desviación estándar
    if (esPoblacionInfinita) {
        const probabilidad = calcularProbabilidadBinomialInfinita(numeroEventos, probabilidadExito, nValoresX);
        const media = calcularMediaBinomial(numeroEventos, probabilidadExito);
        const desviacionEstandar = calcularDesviacionEstandarBinomial(numeroEventos, probabilidadExito);
        const sesgo = calcularSesgo(numeroEventos, probabilidadExito);
        const valorSesgo = evaluarSesgo(sesgo);
        const curtosis = calcularCurtosis(numeroEventos, probabilidadExito);
        const valorCurtosis = evaluarCurtosis(curtosis);
        const resultados = calcularProbabilidadesBinomialesInfinita(numeroEventos, probabilidadExito, nValoresX);

        // Mostrar el resultado en el elemento con id 'resultado'
        document.getElementById('rtitle').innerText = "Resultado:";
        document.getElementById('resultado').innerText = `-Probabilidad: ${probabilidad.toFixed(4)}
        -Media: ${media.toFixed(4)}
        -Desviación Estándar: ${desviacionEstandar.toFixed(4)}
        -Sesgo: ${sesgo.toFixed(4)} = ${valorSesgo}
        -Curtosis; ${curtosis.toFixed(4)} = ${valorCurtosis}`;
        // Configuración de la gráfica
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
    } else {
        const probabilidad = calcularProbabilidadBinomialFinita(numeroEventos, probabilidadExito, nValoresX);
        const media = calcularMediaBinomial(numeroEventos, probabilidadExito);
        const factor = factorCorreccion(numeroEventos, poblacionTotal);
        const desviacionEstandar = desviacionEstandarFinita(numeroEventos, poblacionTotal, probabilidadExito);
        const sesgo = calcularSesgo(numeroEventos, probabilidadExito);
        const valorSesgo = evaluarSesgo(sesgo);
        const curtosis = calcularCurtosis(numeroEventos, probabilidadExito);
        const valorCurtosis = evaluarCurtosis(curtosis);
        const resultados = calcularProbabilidadesBinomialesFinita(poblacionTotal, probabilidadExito);

        // Mostrar el resultado en el elemento con id 'resultado'
        document.getElementById('rtitle').innerText = "Resultado:";
        document.getElementById('resultado').innerText = `-Probabilidad: ${probabilidad.toFixed(4)}
        -Media: ${media.toFixed(4)}
        -Factor de corrección: ${factor.toFixed(4)}
        -Desviación Estándar: ${desviacionEstandar.toFixed(4)}
        -Sesgo: ${sesgo.toFixed(4)} = ${valorSesgo}
        -Curtosis: ${curtosis.toFixed(4)} = ${valorCurtosis}`;
        
        // Configuración de la gráfica
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
}

function calcularProbabilidadBinomialInfinita(n, p, x) {
    /**
     * Calcula la probabilidad binomial para n eventos con probabilidad p de éxito en x eventos.
     */
    const q = 1 - p; // Probabilidad de fracaso
    const probabilidad = comb(n, x) * Math.pow(p, x) * Math.pow(q, n - x);
    return probabilidad;
}

// Esta función es escencial para la gráfica
function calcularProbabilidadesBinomialesInfinita(n, p, nValoresX) {
    const resultados = [];

    for (let x = 0; x <= nValoresX; x++) {
        resultados.push(calcularProbabilidadBinomialInfinita(n, p, x));
    }

    return resultados;
}

function calcularProbabilidadBinomialFinita(N, p, x) {
    const q = 1 - p;
    return comb2(N, x) * Math.pow(p, x) * Math.pow(q, N - x);
}

function calcularProbabilidadesBinomialesFinita(N, p) {
    const resultados = [];

    for (let x = 0; x <= N; x++) {
        resultados.push(calcularProbabilidadBinomialFinita(N, p, x));
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

// Función para calcular combinaciones (nCr)
function comb(n, r) {
    if (r > n) return 0;
    if (r === 0 || r === n) return 1;
    return comb(n - 1, r - 1) + comb(n - 1, r);
}

function comb2(N, k) {
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

//Funcion para desviación estándar con población finita.
function desviacionEstandarFinita(n, N, p){
    const q = 1 - p;
    const frac1 = N - n;
    const frac2 = N - 1;
    const factor = Math.sqrt(frac1/frac2);
    const desviacionEstandar = Math.sqrt(n * p * q);
    return factor * desviacionEstandar;
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