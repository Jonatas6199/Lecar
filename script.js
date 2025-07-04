document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const clientsUl = document.getElementById('clients-ul');
    const noClientsMessage = document.getElementById('no-clients-message'); // Nova mensagem de "nenhum cliente"

    const clientSearchInput = document.getElementById('client-search'); // Campo de busca
    const carModelFilter = document.getElementById('car-model-filter'); // Filtro por carro
    const paymentStatusFilter = document.getElementById('payment-status-filter'); // Filtro por status de pagamento

    const totalPaidValueElement = document.getElementById('total-paid-value'); // Elemento para total pago
    const totalPendingValueElement = document.getElementById('total-pending-value'); // Elemento para total pendente
    const paymentChartCanvas = document.getElementById('paymentChart'); // Canvas para o gráfico

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
    let currentClientData = null;
    let paymentChartInstance = null; // Para armazenar a instância do Chart.js

    // Dados de demonstração (adicionando mais clientes e modelos de carro)
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
        },
        {
            id: 'user003',
            name: 'Carlos Oliveira',
            cpf: '111.222.333-44',
            carModel: 'Lecar Campo',
            payments: {
                method: 'Bolepix',
                totalInstallments: 36,
                installments: Array.from({ length: 36 }, (_, i) => ({
                    id: i + 1,
                    value: 1500.00,
                    paid: i < 15, // 15 pagos, 21 pendentes
                    date: `2024-${String(i + 1).padStart(2, '0')}-05` // Data simulada
                }))
            }
        },
        {
            id: 'user004',
            name: 'Diana Pires',
            cpf: '555.666.777-88',
            carModel: 'Lecar 459',
            payments: {
                method: 'Bolepix',
                totalInstallments: 10,
                installments: Array.from({ length: 10 }, (_, i) => ({
                    id: i + 1,
                    value: 4000.00,
                    paid: i < 10, // Todos pagos
                    date: `2024-${String(i + 1).padStart(2, '0')}-20`
                }))
            }
        }
    ];

    // --- Funções do Dashboard ---

    // Função para renderizar a lista de clientes com filtros e busca
    function renderClientList() {
        const searchTerm = clientSearchInput.value.toLowerCase();
        const selectedCarModel = carModelFilter.value;
        const selectedPaymentStatus = paymentStatusFilter.value;

        let filteredClients = demoClients.filter(client => {
            const matchesSearch = client.name.toLowerCase().includes(searchTerm);
            const matchesCarModel = selectedCarModel === 'all' || client.carModel === selectedCarModel;

            let matchesPaymentStatus = true;
            if (selectedPaymentStatus !== 'all') {
                const totalPaid = client.payments.installments.filter(b => b.paid).length;
                const totalInstallments = client.payments.totalInstallments;
                if (selectedPaymentStatus === 'paid') {
                    matchesPaymentStatus = (totalPaid === totalInstallments);
                } else if (selectedPaymentStatus === 'pending') {
                    matchesPaymentStatus = (totalPaid < totalInstallments);
                }
            }
            return matchesSearch && matchesCarModel && matchesPaymentStatus;
        });

        clientsUl.innerHTML = ''; // Limpa a lista existente

        if (filteredClients.length === 0) {
            noClientsMessage.classList.remove('hidden');
        } else {
            noClientsMessage.classList.add('hidden');
            filteredClients.forEach(client => {
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
    }

    // Função para preencher o filtro de modelos de carro
    function populateCarModelFilter() {
        const carModels = [...new Set(demoClients.map(client => client.carModel))];
        carModels.sort().forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            carModelFilter.appendChild(option);
        });
    }

    // Função para calcular e exibir totais e renderizar o gráfico
    function updateDashboardSummary() {
        let totalPaid = 0;
        let totalPending = 0;
        const salesByCarModel = {}; // { 'Lecar 459': { paid: 0, pending: 0 } }

        demoClients.forEach(client => {
            if (!salesByCarModel[client.carModel]) {
                salesByCarModel[client.carModel] = { paid: 0, pending: 0 };
            }

            client.payments.installments.forEach(boleto => {
                if (boleto.paid) {
                    totalPaid += boleto.value;
                    salesByCarModel[client.carModel].paid += boleto.value;
                } else {
                    totalPending += boleto.value;
                    salesByCarModel[client.carModel].pending += boleto.value;
                }
            });
        });

        totalPaidValueElement.textContent = `R$ ${totalPaid.toFixed(2).replace('.', ',')}`;
        totalPendingValueElement.textContent = `R$ ${totalPending.toFixed(2).replace('.', ',')}`;

        renderPaymentChart(salesByCarModel);
    }

    // Função para renderizar o gráfico com Chart.js
    function renderPaymentChart(data) {
        const labels = Object.keys(data);
        const paidData = labels.map(model => data[model].paid);
        const pendingData = labels.map(model => data[model].pending);

        // Destrói a instância anterior do gráfico se existir
        if (paymentChartInstance) {
            paymentChartInstance.destroy();
        }

        paymentChartInstance = new Chart(paymentChartCanvas, {
            type: 'bar', // Pode ser 'bar', 'doughnut', 'pie', etc.
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Recebido',
                        data: paidData,
                        backgroundColor: 'rgba(40, 167, 69, 0.7)', // Verde
                        borderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Total Pendente',
                        data: pendingData,
                        backgroundColor: 'rgba(220, 53, 69, 0.7)', // Vermelho
                        borderColor: 'rgba(220, 53, 69, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Importante para controle de tamanho
                scales: {
                    x: {
                        stacked: true, // Empilha as barras
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true, // Empilha as barras
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }


    // --- Funções de Login/Logout e Modal de Pagamento (Mantidas as mesmas) ---

    // Função para simular o login
    loginButton.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email === 'teste@lecar.com' && password === 'lecar123') {
            loginScreen.classList.remove('active');
            dashboardScreen.classList.add('active');
            populateCarModelFilter(); // Popula o filtro de carros ao entrar
            updateDashboardSummary(); // Atualiza o resumo e o gráfico
            renderClientList(); // Renderiza a lista inicial
        } else {
            alert('Email ou senha inválidos. Use: teste@lecar.com / lecar123');
        }
    });

    // Função para simular o logout
    logoutButton.addEventListener('click', () => {
        dashboardScreen.classList.remove('active');
        loginScreen.classList.add('active');
        emailInput.value = '';
        passwordInput.value = '';
        clientsUl.innerHTML = '';
        clientSearchInput.value = ''; // Limpa a busca
        carModelFilter.value = 'all'; // Reseta o filtro de carro
        paymentStatusFilter.value = 'all'; // Reseta o filtro de status
        if (paymentChartInstance) { // Destrói o gráfico ao sair
            paymentChartInstance.destroy();
            paymentChartInstance = null;
        }
    });

    // Mostra os detalhes de pagamento do cliente no modal
    function showPaymentDetails(clientId) {
        currentClientData = demoClients.find(client => client.id === clientId);
        if (!currentClientData) return;

        modalClientName.textContent = currentClientData.name;
        modalClientCpf.textContent = currentClientData.cpf;
        modalCarModel.textContent = currentClientData.carModel;

        renderBoletos();
        renderAnticipationBoletos();
        selectedBoletos = [];
        updateAnticipationTotal();
        paymentLinkMessage.classList.add('hidden');

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
                <span>R$ ${boleto.value.toFixed(2).replace('.', ',')}</span>
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
                <span>R$ ${boleto.value.toFixed(2).replace('.', ',')}</span>
                <span>${boleto.date}</span>
            `;
            boletoDiv.addEventListener('click', () => toggleBoletoSelection(boleto.id));
            anticipateBoletosContainer.appendChild(boletoDiv);
        });
        generatePaymentLinkButton.disabled = true;
    }

    // Alterna a seleção de um boleto para antecipação
    function toggleBoletoSelection(boletoId) {
        const index = selectedBoletos.indexOf(boletoId);
        const boletoElement = anticipateBoletosContainer.querySelector(`[data-boleto-id="${boletoId}"]`);

        if (index > -1) {
            selectedBoletos.splice(index, 1);
            boletoElement.classList.remove('selected');
        } else {
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
        anticipationTotalValue.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
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

        const paymentLink = `https://lecar.com/pagamento-antecipado?valor=${totalValue.toFixed(2)}&boletos=${selectedBoletos.join(',')}`;
        paymentLinkMessage.querySelector('a').href = paymentLink;
        paymentLinkMessage.querySelector('a').textContent = 'Clique aqui para pagar';
        paymentLinkMessage.classList.remove('hidden');

        setTimeout(() => {
            selectedBoletos.forEach(boletoId => {
                const boleto = currentClientData.payments.installments.find(b => b.id === boletoId);
                if (boleto) {
                    boleto.paid = true;
                    boleto.date = new Date().toISOString().split('T')[0];
                }
            });
            alert(`Pagamento de R$ ${totalValue.toFixed(2).replace('.', ',')} simulado com sucesso! Boletos atualizados.`);
            renderBoletos();
            renderAnticipationBoletos();
            selectedBoletos = [];
            updateAnticipationTotal();
            paymentLinkMessage.classList.add('hidden');
            
            // Re-renderiza a lista de clientes e o resumo do dashboard após o pagamento simulado
            renderClientList();
            updateDashboardSummary();
        }, 2000);
    });

    // --- Event Listeners para busca e filtros ---
    clientSearchInput.addEventListener('input', renderClientList);
    carModelFilter.addEventListener('change', renderClientList);
    paymentStatusFilter.addEventListener('change', renderClientList);

    // Inicia na tela de login
    loginScreen.classList.add('active');
});
