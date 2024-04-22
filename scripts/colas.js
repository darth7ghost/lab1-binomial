function calcularColas(){
    // Obtener los valores ingresados por el usuario
    const llegada = parseFloat(document.getElementById('llegada').value);
    const servicio = parseFloat(document.getElementById('servicio').value);
    const nClientes = parseInt(document.getElementById('nClientes').value);
    const wqt = parseInt(document.getElementById('wqt').value);
    const wst = parseInt(document.getElementById('wst').value);

    //AGREGAR TIEMPO ESPERADO EN COLA, PROBABILIDAD DE CALCULAR TIEMPO EN SISTEMA

    reiniciarValores();

    // Mostrar el resultado en el elemento con id 'resultado'
    document.getElementById('ctitle').innerText = "Resultado:";

    //OPERAR LOS RESULTADOS
    calcularProbabilidadUso(llegada, servicio);
    var wq = calcularTiempoCola(llegada, servicio);
    calcularPersonasCola(llegada, wq);
    calcularTiempoSistema(wq, servicio);
    var ws = calcularTiempoSistema(wq, servicio);
    calcularPersonasSistema(llegada, ws);
    if(!isNaN(nClientes)){
        if(isNaN(llegada) || isNaN(servicio)){
            alert('No hay datos suficientes de media de llegada o servicio para calcular cantidad exacta de clientes.');
        } else {
            const pn = calcularClientesExactos(llegada, servicio, nClientes);
            document.getElementById('pn').innerText = `Probabilidad de haber no. de clientes especificados (Pn): ➥ ${pn.toFixed(4)}`;
            var pnMax = 0;
            const resultados = calcularClientesExactosN(llegada, servicio, nClientes);
            for (var x = 0; x < resultados.length; x++){
                pnMax = pnMax + resultados[x];
            }
            document.getElementById('pnMax').innerText = `Probabilidad de haber hasta un máximo de "n" clientes: ➥ ${pnMax.toFixed(4)}`;
            let pnMin = 1 - pnMax;
            document.getElementById('pnMin').innerText = `Probabilidad de haber como mínimo "n" clientes: ➥ ${pnMin.toFixed(4)}`;
            tablaClientes(resultados);
            graficaClientes(resultados, nClientes)
        }
    }
    if(!isNaN(wqt)){
        calcularTiempoEsperadoCola(llegada, servicio, wqt);
    }

    if(!isNaN(wst)){
        calcularTiempoEsperadoSistema(llegada, servicio, wst);
    }
}

function reiniciarValores(){
    document.getElementById('Lq').append("");
    document.getElementById('Wq').append("");
    document.getElementById('Ls').append("");
    document.getElementById('Ws').append("");
    document.getElementById('p').append("");
    document.getElementById('p0').append("");
    document.getElementById('pn').append("");
}

function calcularProbabilidadUso(llegada, servicio){
    var pUso = llegada/servicio;
    var pOcio = 1 - pUso;
    document.getElementById('p').innerText = `Probabilidad de uso del sistema (P): ➥ ${pUso.toFixed(4)}`;
    document.getElementById('p0').innerText = `Probabilidad de sistema desocupado (P0): ➥ ${pOcio.toFixed(4)}`;
}

function calcularTiempoCola(llegada, servicio){
    var division = servicio * (servicio - llegada);
    var tiempoCola = llegada/division;
    document.getElementById('Wq').innerText = `Tiempo de espera en la cola (Wq): ➥ ${tiempoCola.toFixed(4)}`;
    return tiempoCola;
}

function calcularPersonasCola(llegada, wq){
    var personasCola = llegada * wq;
    document.getElementById('Lq').innerText = `Número de personas en la cola (Lq): ➥ ${personasCola.toFixed(4)}`;
    return personasCola;
}

function calcularTiempoSistema(wq, servicio){
    var tiempoSistema = wq + (1/servicio);
    document.getElementById('Ws').innerText = `Tiempo de espera en el sistema (Ws): ➥ ${tiempoSistema.toFixed(4)}`;
    return tiempoSistema;
}

function calcularPersonasSistema(llegada, ws){
    var personasSistema = llegada * ws;
    document.getElementById('Ls').innerText = `Número de personas en el sistema (Ls): ➥ ${personasSistema.toFixed(4)}`;
    return personasSistema;
}

function calcularClientesExactos(llegada, servicio, nClientes){
    if(nClientes === 0){
        let pn = 1 - (llegada / servicio);
        return pn;
    } else {
        // Calcular el factor de utilización (rho)
        let rho = llegada / servicio;
        // Calcular la probabilidad Pn
        let pn = (1 - rho) * Math.pow(rho, nClientes);
        return pn;
    }
}



function calcularClientesExactosN(llegada, servicio, nClientes){
    const resultados = [];
    if(nClientes === 0){
        let pn = 1 - (llegada / servicio);
        resultados.push(pn);
        return resultados;
    }
    else{
        for (let x = 0; x <= nClientes; x++) {
            resultados.push(calcularClientesExactos(llegada, servicio, x));
        }
        return resultados;
    }
}

function calcularTiempoEsperadoCola(llegada, servicio, wqt){
    const p = llegada / servicio;
    const u = servicio * (-1);
    const tiempo = p * Math.exp(u * (1 - p) * wqt);
    document.getElementById('pwqt').innerText = `Probabilidad de tiempo de espera en cola P(Wq>t): ${tiempo.toFixed(4)}`;
}

function calcularTiempoEsperadoSistema(llegada, servicio, wst){
    const p = llegada / servicio;
    const u = servicio * (-1);
    const tiempo = Math.exp(u * (1 - p) * wst);
    document.getElementById('pwst').innerText = `Probabilidad de tiempo de espera en el sistema P(Ws>t): ➥ ${tiempo.toFixed(4)}`;
}

function tablaClientes(listaClientes){
    document.getElementById('tpntitle').innerText = "Tabla de probabilidad máximo 'n' clientes:";
    const tablanBody = document.getElementById('tablanBody');
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
        tablanBody.appendChild(fila);
    }
}

function graficaClientes(listaClientes, nClientes){
    document.getElementById('nclientestitle').innerText = "Gráfica de probabilidad máximo 'n' clientes:";
    const ctx = document.getElementById('probabilidadNChart').getContext('2d');
    const probabilidadNChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: nClientes + 1 }, (_, i) => i), // Etiquetas para cada valor de X
            datasets: [{
                label: 'Distribución de Poisson',
                data: listaClientes,
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