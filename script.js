document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const clientsUl = document.getElementById('clients-ul');
    const paymentDetailsModal = document.getElementById('payment-details-modal');
    const closeButton = paymentDetailsModal.querySelector('.close-button');
    const modalClientName = document.getElementById('modal-client-name');
    const modalClientCpf = document.getElementById('modal-client-cpf');
    const modalCarModel = document.getElementById('modal-car-model');
    const boletoStatusContainer = document.getElementById('boleto-status-container');
    const anticipateBoletosContainer = document.getElementById('anticipate-boletos-container');
    const anticipationTotalValue = document.getElementById('anticipation-total-value');
    const generatePaymentLinkButton = document.getElementById('generate-payment-link-button');
    const paymentLinkMessage = document.getElementById('payment-link-message');

    let selectedBoletos = [];
    let currentClientData = null; // Para armazenar os dados do cliente atualmente visualizado

    // Dados de demonstração (mantêm os mesmos dados)
    const demoClients = [
        {
            id: 'user001',
            name: 'Ana Silva',
            cpf: '123.456.789-00',
            carModel: 'Lecar 459',
            payments: {
                method: 'Bolepix',
                totalInstallments: 24,
                installments: [
                    { id: 1, value: 2500.00, paid: true, date: '2024-01-10' },
                    { id: 2, value: 2500.00, paid: true, date: '2024-02-10' },
                    { id: 3, value: 2500.00, paid: true, date: '2024-03-10' },
                    { id: 4, value: 2500.00, paid: true, date: '2024-04-10' },
                    { id: 5, value: 2500.00, paid: true, date: '2024-05-10' },
                    { id: 6, value: 2500.00, paid: true, date: '2024-06-10' },
                    { id: 7, value: 2500.00, paid: true, date: '2024-07-10' },
                    { id: 8, value: 2500.00, paid: true, date: '2024-08-10' },
                    { id: 9, value: 2500.00, paid: true, date: '2024-09-10' },
                    { id: 10, value: 2500.00, paid: true, date: '2024-10-10' },
                    { id: 11, value: 2500.00, paid: false, date: '2024-11-10' },
                    { id: 12, value: 2500.00, paid: false, date: '2024-12-10' },
                    { id: 13, value: 2500.00, paid: false, date: '2025-01-10' },
                    { id: 14, value: 2500.00, paid: false, date: '2025-02-10' },
                    { id: 15, value: 2500.00, paid: false, date: '2025-03-10' },
                    { id: 16, value: 2500.00, paid: false, date: '2025-04-10' },
                    { id: 17, value: 2500.00, paid: false, date: '2025-05-10' },
                    { id: 18, value: 2500.00, paid: false, date: '2025-06-10' },
                    { id: 19, value: 2500.00, paid: false, date: '2025-07-10' },
                    { id: 20, value: 2500.00, paid: false, date: '2025-08-10' },
                    { id: 21, value: 2500.00, paid: false, date: '2025-09-10' },
                    { id: 22, value: 2500.00, paid: false, date: '2025-10-10' },
                    { id: 23, value: 2500.00, paid: false, date: '2025-11-10' },
                    { id: 24, value: 2500.00, paid: false, date: '2025-12-10' }
                ]
            }
        },
        {
            id: 'user002',
            name: 'Bruno Costa',
            cpf: '987.654.321-99',
            carModel: 'Lecar Campo',
            payments: {
                method: 'Bolepix',
                totalInstallments: 12,
                installments: [
                    { id: 1, value: 3000.00, paid: true, date: '2024-03-01' },
                    { id: 2, value: 3000.00, paid: true, date: '2024-04-01' },
                    { id: 3, value: 3000.00, paid: true, date: '2024-05-01' },
                    { id: 4, value: 3000.00, paid: false, date: '2024-06-01' },
                    { id: 5, value: 3000.00, paid: false, date: '2024-07-01' },
                    { id: 6, value: 3000.00, paid: false, date: '2024-08-01' },
                    { id: 7, value: 3000.00, paid: false, date: '2024-09-01' },
                    { id: 8, value: 3000.00, paid: false, date: '2024-10-01' },
                    { id: 9, value: 3000.00, paid: false, date: '2024-11-01' },
                    { id: 10, value: 3000.00, paid: false, date: '2024-12-01' },
                    { id: 11, value: 3000.00, paid: false, date: '2025-01-01' },
                    { id: 12, value: 3000.00, paid: false, date: '2025-02-01' }
                ]
            }
        }
    ];

    // Função para simular o login
    loginButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        // Simples validação para a demo
        if (email === 'teste@lecar.com' && password === 'lecar123') {
            loginScreen.classList.remove('active'); // Remove a classe 'active' da tela de login
            dashboardScreen.classList.add('active'); // Adiciona a classe 'active' à tela do dashboard
            renderClientList();
        } else {
            alert('Email ou senha inválidos. Use: teste@lecar.com / lecar123');
        }
    });

    // Função para simular o logout
    logoutButton.addEventListener('click', () => {
        dashboardScreen.classList.remove('active'); // Remove a classe 'active' do dashboard
        loginScreen.classList.add('active'); // Adiciona a classe 'active' à tela de login
        emailInput.value = '';
        passwordInput.value = '';
        clientsUl.innerHTML = ''; // Limpa a lista de clientes
    });

    // ... (o restante do seu JavaScript permanece o mesmo) ...

    // Renderiza a lista de clientes no dashboard
    function renderClientList() {
        clientsUl.innerHTML = ''; // Limpa a lista existente
        demoClients.forEach(client => {
            const li = document.createElement('li');
            li.dataset.clientId = client.id;
            li.innerHTML = `
                <span>${client.name} - ${client.cpf}</span>
                <span>${client.carModel}</span>
            `;
            li.addEventListener('click', () => showPaymentDetails(client.id));
            clientsUl.appendChild(li);
        });
    }

    // Mostra os detalhes de pagamento do cliente no modal
    function showPaymentDetails(clientId) {
        currentClientData = demoClients.find(client => client.id === clientId);
        if (!currentClientData) return;

        modalClientName.textContent = currentClientData.name;
        modalClientCpf.textContent = currentClientData.cpf;
        modalCarModel.textContent = currentClientData.carModel;

        renderBoletos();
        renderAnticipationBoletos(); // Renderiza os boletos para antecipação
        selectedBoletos = []; // Reseta a seleção
        updateAnticipationTotal(); // Atualiza o total para 0
        paymentLinkMessage.classList.add('hidden'); // Esconde a mensagem do link

        paymentDetailsModal.classList.add('active');
    }

    // Fecha o modal de detalhes de pagamento
    closeButton.addEventListener('click', () => {
        paymentDetailsModal.classList.remove('active');
    });

    // Fecha o modal se clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target === paymentDetailsModal) {
            paymentDetailsModal.classList.remove('active');
        }
    });

    // Renderiza os boletos (pagos e pendentes)
    function renderBoletos() {
        boletoStatusContainer.innerHTML = '';
        currentClientData.payments.installments.forEach(boleto => {
            const boletoDiv = document.createElement('div');
            boletoDiv.classList.add('boleto-item');
            boletoDiv.classList.add(boleto.paid ? 'paid' : 'pending');
            boletoDiv.innerHTML = `
                <span>Boleto ${boleto.id}</span>
                <span>R$ ${boleto.value.toFixed(2)}</span>
                <span>${boleto.paid ? 'Pago' : 'Pendente'}</span>
                ${boleto.paid ? `<span>${boleto.date}</span>` : ''}
            `;
            boletoStatusContainer.appendChild(boletoDiv);
        });
    }

    // Renderiza os boletos para seleção de antecipação
    function renderAnticipationBoletos() {
        anticipateBoletosContainer.innerHTML = '';
        const pendingBoletos = currentClientData.payments.installments.filter(boleto => !boleto.paid);

        if (pendingBoletos.length === 0) {
            anticipateBoletosContainer.innerHTML = '<p>Não há boletos pendentes para antecipação.</p>';
            generatePaymentLinkButton.disabled = true;
            return;
        }

        pendingBoletos.forEach(boleto => {
            const boletoDiv = document.createElement('div');
            boletoDiv.classList.add('boleto-item', 'pending');
            boletoDiv.dataset.boletoId = boleto.id;
            boletoDiv.innerHTML = `
                <span>Boleto ${boleto.id}</span>
                <span>R$ ${boleto.value.toFixed(2)}</span>
                <span>${boleto.date}</span>
            `;
            boletoDiv.addEventListener('click', () => toggleBoletoSelection(boleto.id));
            anticipateBoletosContainer.appendChild(boletoDiv);
        });
        generatePaymentLinkButton.disabled = true; // Desabilita por padrão
    }

    // Alterna a seleção de um boleto para antecipação
    function toggleBoletoSelection(boletoId) {
        const index = selectedBoletos.indexOf(boletoId);
        const boletoElement = anticipateBoletosContainer.querySelector(`[data-boleto-id="${boletoId}"]`);

        if (index > -1) {
            // Remove da seleção
            selectedBoletos.splice(index, 1);
            boletoElement.classList.remove('selected');
        } else {
            // Adiciona à seleção
            selectedBoletos.push(boletoId);
            boletoElement.classList.add('selected');
        }
        updateAnticipationTotal();
    }

    // Atualiza o valor total da antecipação
    function updateAnticipationTotal() {
        let total = 0;
        currentClientData.payments.installments.forEach(boleto => {
            if (selectedBoletos.includes(boleto.id)) {
                total += boleto.value;
            }
        });
        anticipationTotalValue.textContent = `R$ ${total.toFixed(2)}`;
        generatePaymentLinkButton.disabled = selectedBoletos.length === 0;
    }

    // Simula a geração do link de pagamento
    generatePaymentLinkButton.addEventListener('click', () => {
        if (selectedBoletos.length === 0) {
            alert('Selecione pelo menos um boleto para antecipar.');
            return;
        }

        const totalValue = parseFloat(anticipationTotalValue.textContent.replace('R$', '').replace(',', '.'));
        if (isNaN(totalValue) || totalValue <= 0) {
            alert('Valor inválido para antecipação.');
            return;
        }

        // Simulação de geração de link de pagamento
        const paymentLink = `https://lecar.com/pagamento-antecipado?valor=${totalValue.toFixed(2)}&boletos=${selectedBoletos.join(',')}`;
        paymentLinkMessage.querySelector('a').href = paymentLink;
        paymentLinkMessage.querySelector('a').textContent = 'Clique aqui para pagar'; // Reset text
        paymentLinkMessage.classList.remove('hidden');

        // Simula o pagamento (para fins de demonstração, marca como pago imediatamente)
        setTimeout(() => {
            selectedBoletos.forEach(boletoId => {
                const boleto = currentClientData.payments.installments.find(b => b.id === boletoId);
                if (boleto) {
                    boleto.paid = true;
                    boleto.date = new Date().toISOString().split('T')[0]; // Atualiza a data para hoje
                }
            });
            alert(`Pagamento de R$ ${totalValue.toFixed(2)} simulado com sucesso! Boletos atualizados.`);
            renderBoletos(); // Re-renderiza os boletos para mostrar os pagos
            renderAnticipationBoletos(); // Re-renderiza a seção de antecipação
            selectedBoletos = []; // Limpa a seleção
            updateAnticipationTotal(); // Zera o total
            paymentLinkMessage.classList.add('hidden'); // Esconde a mensagem
        }, 2000); // Simula um atraso de 2 segundos para o processamento
    });

    // Inicia na tela de login
    loginScreen.classList.add('active');
});