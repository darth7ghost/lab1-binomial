function calcularDistribucionHipergeometrica(){
    // Obtener los valores ingresados por el usuario
    const nValoresX = parseInt(document.getElementById('nValoresX').value);
    const numeroEventos = parseInt(document.getElementById('numeroEventos').value);
    const exitos = parseInt(document.getElementById('exitos').value);
    const poblacionTotal = parseInt(document.getElementById('poblacionTotal').value);

    reiniciarValores();

    const probabilidad = calcularProbabilidadExitos(poblacionTotal, exitos);
    document.getElementById('pexitos').innerText = `Probabilidad de éxitos total: ${probabilidad.toFixed(4)}`;

    const probabilidadxd = calcularProbabilidad(exitos, numeroEventos, poblacionTotal, nValoresX);
    document.getElementById('pexitosX').innerText = `Probabilidad de éxitos para X valores: ${probabilidadxd.toFixed(4)}`;


    calcularMediaBinomial(exitos, numeroEventos, poblacionTotal);
    //------------ POISSON ----------------
    if(probabilidad < 0.10 && media < 10){
        probabilidadpoisson = calcularPoisson(media, numeroEventos);
        document.getElementById('probabilidadpoisson').innerText = `Probabilidad de Poisson para X valores: ${probabilidadpoisson.toFixed(4)}`;
        distribucionPoisson(media, numeroEventos);
    }
    //------------ POISSON ----------------
    calcularDesviacionEstandarBinomial(exitos, numeroEventos, poblacionTotal);
    calcularSesgo(exitos, numeroEventos, poblacionTotal);
    calcularCurtosis(exitos, numeroEventos, poblacionTotal);
    const resultados = probabilidadVisual(exitos, numeroEventos, poblacionTotal);
    grafica(exitos, resultados);
    tabla(resultados);
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
    document.getElementById('media').innerText = `Media: ${media.toFixed(4)}`;
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

function probabilidadVisual(nValoresX, numeroEventos, poblacionTotal){
    const resultados = [];
    for (let x = 0; x <= nValoresX; x++) {
        resultados.push(calcularProbabilidad(nValoresX, numeroEventos, poblacionTotal, x));
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

function grafica(nValoresX, resultados){
    document.getElementById('gtitle').innerText = "Gráfica de probabilidad X:";
    const ctx = document.getElementById('probabilidadChart').getContext('2d');
    const probabilidadChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: nValoresX + 1 }, (_, i) => i), // Etiquetas para cada valor de X
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

function tabla(listaClientes){
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
        const celdaArray1 = document.createElement('td');
        celdaArray1.textContent = listaClientes[i];
        fila.appendChild(celdaArray1);
        // Agrega la fila a la tabla
        tablaBody.appendChild(fila);
    }
}