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
    const esPoblacionInfinita = evaluarPoblacionInfinita(nValoresX, poblacionTotal);

    // Lógica para calcular la probabilidad, media y desviación estándar
    if (esPoblacionInfinita) {
        const probabilidad = calcularProbabilidadBinomial(numeroEventos, probabilidadExito, nValoresX);
        const media = calcularMediaBinomial(numeroEventos, probabilidadExito);
        const desviacionEstandar = calcularDesviacionEstandarBinomial(numeroEventos, probabilidadExito);

        // Mostrar el resultado en el elemento con id 'resultado'
        document.getElementById('rtitle').innerText = "Resultado:";
        document.getElementById('resultado').innerText = `-Probabilidad: ${probabilidad.toFixed(4)}\n-Media: ${media.toFixed(4)}\n-Desviación Estándar: ${desviacionEstandar.toFixed(4)}`;
    } else {
        document.getElementById('rtitle').innerText = "¡Ups!";
        document.getElementById('resultado').innerText = "La población no cumple con los criterios para ser considerada infinita.";
    }
}

function calcularProbabilidadBinomial(n, p, x) {
    /**
     * Calcula la probabilidad binomial para n eventos con probabilidad p de éxito en x eventos.
     */
    const q = 1 - p; // Probabilidad de fracaso
    const probabilidad = comb(n, x) * Math.pow(p, x) * Math.pow(q, n - x);
    return probabilidad;
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