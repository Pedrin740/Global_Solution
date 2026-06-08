// =============================
// CAPTURAR LOCALIZAÇÃO
// =============================

const btnLocalizacao =
    document.getElementById("capturarLocalizacao");

if(btnLocalizacao){

    btnLocalizacao.addEventListener("click", () => {

        navigator.geolocation.getCurrentPosition(
            (posicao) => {

                document.getElementById("latitude").value =
                    posicao.coords.latitude;

                document.getElementById("longitude").value =
                    posicao.coords.longitude;

                alert("Localização capturada com sucesso!");

            },
            () => {

                alert(
                    "Não foi possível obter sua localização."
                );

            }
        );

    });

}

// =============================
// CADASTRAR OCORRÊNCIA
// =============================

const formulario =
    document.getElementById("formOcorrencia");

if(formulario){

    formulario.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const ocorrencia = {

                tipo:
                    document.getElementById("tipo").value,

                latitude: parseFloat(
                    document.getElementById("latitude").value
                ),

                longitude: parseFloat(
                    document.getElementById("longitude").value
                ),

                descricao:
                    document.getElementById("descricao").value,

                data:
                    new Date().toLocaleString()

            };

            let ocorrencias =
                JSON.parse(
                    localStorage.getItem(
                        "ocorrencias"
                    )
                ) || [];

            ocorrencias.push(ocorrencia);

            localStorage.setItem(
                "ocorrencias",
                JSON.stringify(ocorrencias)
            );

            alert(
                "Ocorrência registrada com sucesso!"
            );

            formulario.reset();

        }
    );

}

// =============================
// MAPA
// =============================

const mapaContainer =
    document.getElementById("map");

if(mapaContainer){

    const map = L.map("map").setView(
        [-23.55052, -46.633308],
        12
    );

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap"
        }
    ).addTo(map);

    // ==========================
    // OCORRÊNCIAS DEMO
    // ==========================

    const ocorrenciasDemo = [

        {
            tipo: "Assalto",
            latitude: -23.5505,
            longitude: -46.6333,
            descricao: "Roubo de celular na região central.",
            data: "03/06/2026, 09:15"
        },

        {
            tipo: "Disparos de Arma de Fogo",
            latitude: -23.5510,
            longitude: -46.6320,
            descricao: "Moradores relataram disparos durante a madrugada.",
            data: "03/06/2026, 23:40"
        },

        {
            tipo: "Arrastão",
            latitude: -23.5485,
            longitude: -46.6345,
            descricao: "Grupo realizou assaltos em sequência.",
            data: "04/06/2026, 20:30"
        },

        {
            tipo: "Torcida Organizada na Região",
            latitude: -23.5274,
            longitude: -46.6784,
            descricao: "Concentração de torcedores antes da partida.",
            data: "04/06/2026, 12:40"
        },

        {
            tipo: "Grande Aglomeração",
            latitude: -23.5640,
            longitude: -46.6520,
            descricao: "Grande fluxo de pessoas na Avenida Paulista.",
            data: "05/06/2026, 18:20"
        },

        {
            tipo: "Veículo Suspeito",
            latitude: -23.5615,
            longitude: -46.6550,
            descricao: "Veículo parado por várias horas.",
            data: "05/06/2026, 21:05"
        },

        {
            tipo: "Briga Generalizada",
            latitude: -23.5480,
            longitude: -46.6380,
            descricao: "Conflito envolvendo diversas pessoas.",
            data: "05/06/2026, 22:10"
        }

    ];

    // ==========================
    // OCORRÊNCIAS DO USUÁRIO
    // ==========================

    const ocorrenciasUsuario =
        JSON.parse(
            localStorage.getItem(
                "ocorrencias"
            )
        ) || [];

    const ocorrencias = [
        ...ocorrenciasDemo,
        ...ocorrenciasUsuario
    ];

    // ==========================
    // CONTADOR DE OCORRÊNCIAS
    // ==========================

    const totalOcorrencias =
        document.getElementById(
            "totalOcorrencias"
        );

    if(totalOcorrencias){

        totalOcorrencias.textContent =
            ocorrencias.length;

    }

    // ==========================
    // MARCADORES
    // ==========================

    ocorrencias.forEach(
        (ocorrencia) => {

            if(
                isNaN(ocorrencia.latitude) ||
                isNaN(ocorrencia.longitude)
            ){
                return;
            }

            L.marker([
                ocorrencia.latitude,
                ocorrencia.longitude
            ])
            .addTo(map)
            .bindPopup(`
                <strong>${ocorrencia.tipo}</strong>
                <br><br>

                ${ocorrencia.descricao}

                <br><br>

                <small>
                    ${ocorrencia.data}
                </small>
            `);

        }
    );

    // ==========================
    // AGRUPAMENTO DE REGIÕES
    // ==========================

    const regioes = [];

    ocorrencias.forEach(
        (ocorrencia) => {

            let encontrouRegiao = false;

            regioes.forEach(
                (regiao) => {

                    const distancia =
                        map.distance(
                            [
                                ocorrencia.latitude,
                                ocorrencia.longitude
                            ],
                            [
                                regiao.latitude,
                                regiao.longitude
                            ]
                        );

                    if(distancia < 800){

                        regiao.ocorrencias++;

                        encontrouRegiao = true;

                    }

                }
            );

            if(!encontrouRegiao){

                regioes.push({

                    latitude:
                        ocorrencia.latitude,

                    longitude:
                        ocorrencia.longitude,

                    ocorrencias: 1

                });

            }

        }
    );

    // ==========================
    // CONTADOR DE REGIÕES
    // ==========================

    const totalRegioes =
        document.getElementById(
            "totalRegioes"
        );

    if(totalRegioes){

        totalRegioes.textContent =
            regioes.length;

    }

    // ==========================
    // DESENHAR REGIÕES DE RISCO
    // ==========================

    regioes.forEach(
        (regiao) => {

            let cor = "green";
            let nivel = "Baixo Risco";
            let raio = 500;

            if(regiao.ocorrencias >= 7){

                cor = "red";
                nivel = "Alto Risco";
                raio = 1200;

            }

            else if(regiao.ocorrencias >= 4){

                cor = "orange";
                nivel = "Médio Risco";
                raio = 800;

            }

            L.circle(
                [
                    regiao.latitude,
                    regiao.longitude
                ],
                {
                    color: cor,
                    fillColor: cor,
                    fillOpacity: 0.30,
                    radius: raio,
                    weight: 2
                }
            )
            .addTo(map)
            .bindPopup(`
                <strong>${nivel}</strong>
                <br>
                ${regiao.ocorrencias}
                ocorrência(s) registradas
                nesta região
            `);

        }
    );

}
    // ==========================
    // AVISO DE PREENCHIMENTO DO FORMULÁRIO PARA O USUÁRIO
    // ==========================
    
    const form = document.getElementById("form");
    const feedback = document.getElementById("feedback");
    
    if (form) {
        
        form.addEventListener("submit", function(event) {
            
            // IMPEDE O ENVIO DO FORMULÁRIO INCOMPLETO
                event.preventDefault();

            // CAPTURA OS VALORES 
                const nome = document.getElementById("nome").value.trim();
                const email = document.getElementById("email").value.trim();
                const motivo = document.getElementById("motivo").value;
                const mensagem = document.getElementById("mensagem").value.trim();

            // VERIFICA SE HÁ ALGUM CAMPO VAZIO
                if (nome === "" || email === "" || motivo === "" || mensagem === "") {
                    feedback.textContent = "⚠️ Preencha todos os campos obrigatórios.";
                    feedback.style.color = "red";
                    return;
}

            // MENSAGEM DE SUCESSO
                feedback.textContent = "✅ Formulário enviado com sucesso!";
                feedback.style.color = "green";
  });
}

// =============================
// BOTÕES DE ENVIO DOS FORMULÁRIOS (CONTATO E OCORRÊNCIAS) 
// =============================

document.querySelectorAll("button")
.forEach((botao) => {

    botao.addEventListener(
        "click",
        function(e){

            const circulo =
                document.createElement("span");

            const tamanho =
                Math.max(
                    this.clientWidth,
                    this.clientHeight
                );

            circulo.style.width =
                tamanho + "px";

            circulo.style.height =
                tamanho + "px";

            circulo.style.left =
                e.offsetX - tamanho/2 + "px";

            circulo.style.top =
                e.offsetY - tamanho/2 + "px";

            circulo.classList.add(
                "ripple"
            );

            const rippleExistente =
                this.querySelector(".ripple");

            if(rippleExistente){

                rippleExistente.remove();

            }

            this.appendChild(circulo);

        }
    );

});

// =============================
// MENU HAMBURGER
// =============================

const hamburger =
    document.getElementById(
        "hamburger"
    );

const menu =
    document.getElementById(
        "menu"
    );

if(hamburger && menu){

    hamburger.addEventListener(
        "click",
        () => {

            menu.classList.toggle(
                "ativo"
            );

            if(
                menu.classList.contains(
                    "ativo"
                )
            ){

                hamburger.innerHTML =
                    "✕";

            }else{

                hamburger.innerHTML =
                    "☰";

            }

        }
    );

}

// =============================
// VALIDAÇÃO DO FORMULÁRIO CONTATO
// =============================

const formContato =
    document.getElementById("form");

if(formContato){

    formContato.addEventListener(
        "submit",
        (event) => {

            const email =
                document.getElementById("email")
                .value
                .trim();

            const feedback =
                document.getElementById(
                    "feedback"
                );

            const regexEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(
                !regexEmail.test(email)
            ){

                event.preventDefault();

                feedback.textContent =
                    "Informe um e-mail válido.";

                feedback.style.color =
                    "#ff4d4d";

                return;

            }

            feedback.textContent =
                "Mensagem enviada com sucesso!";

            feedback.style.color =
                "#00cc66";

        }
    );

}
