document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const newClientButton = document.getElementById('new-client-button'); // Novo botão
    const clientsUl = document.getElementById('clients-ul');
    const noClientsMessage = document.getElementById('no-clients-message');

    const clientSearchInput = document.getElementById('client-search');
    const carModelFilter = document.getElementById('car-model-filter');
    const paymentStatusFilter = document.getElementById('payment-status-filter');

    const totalPaidValueElement = document.getElementById('total-paid-value');
    const totalPendingValueElement = document.getElementById('total-pending-value');
    const paymentChartCanvas = document.getElementById('paymentChart');

    // Elementos do modal de detalhes de pagamento
    const paymentDetailsModal = document.getElementById('payment-details-modal');
    const closeButtons = document.querySelectorAll('.close-button'); // Seleciona todos os botões de fechar
    const modalClientName = document.getElementById('modal-client-name');
    const modalClientCpf = document.getElementById('modal-client-cpf');
    const modalCarModel = document.getElementById('modal-car-model');
    const boletoStatusContainer = document.getElementById('boleto-status-container');
    const anticipateBoletosContainer = document.getElementById('anticipate-boletos-container');
    const anticipationTotalValue = document.getElementById('anticipation-total-value');
    const generatePaymentLinkButton = document.getElementById('generate-payment-link-button');
    const paymentLinkMessage = document.getElementById('payment-link-message');

    // Elementos do NOVO MODAL de cadastro de cliente
    const newClientModal = document.getElementById('new-client-modal');
    const newClientForm = document.getElementById('new-client-form');
    const newClientNameInput = document.getElementById('new-client-name');
    const newClientCpfInput = document.getElementById('new-client-cpf');
    const newClientCarModelSelect = document.getElementById('new-client-car-model');
    const newClientInstallmentsInput = document.getElementById('new-client-installments');
    const newClientInstallmentValueInput = document.getElementById('new-client-installment-value');
    const newClientDueDateInput = document.getElementById('new-client-due-date');

    let selectedBoletos = [];
    let currentClientData = null;
    let paymentChartInstance = null;

    // Dados de demonstração (mantidos e incrementados com mais carros para o filtro)
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
            carModel: 'Lecar 459',
            payments: {
                method: 'Bolepix',
                totalInstallments: 36,
                installments: Array.from({ length: 36 }, (_, i) => ({
                    id: i + 1,
                    value: 1500.00,
                    paid: i < 15, // 15 pagos, 21 pendentes
                    date: `2024-${String(i + 1).padStart(2, '0')}-05`
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
        },
        {
            id: 'user005',
            name: 'Fernando Rocha',
            cpf: '777.888.999-00',
            carModel: 'Lecar Campo',
            payments: {
                method: 'Bolepix',
                totalInstallments: 18,
                installments: Array.from({ length: 18 }, (_, i) => ({
                    id: i + 1,
                    value: 3500.00,
                    paid: i < 2, // 2 pagos, 16 pendentes
                    date: `2024-${String(i + 1).padStart(2, '0')}-15`
                }))
            }
        },
        {
            id: 'user006',
            name: 'Gabriela Alves',
            cpf: '101.202.303-40',
            carModel: 'Lecar Campo',
            payments: {
                method: 'Bolepix',
                totalInstallments: 6,
                installments: Array.from({ length: 6 }, (_, i) => ({
                    id: i + 1,
                    value: 2000.00,
                    paid: false, // Nenhum pago
                    date: `2024-${String(i + 1).padStart(2, '0')}-25`
                }))
            }
        }
    ];

    // Modelos de carro disponíveis (para o select de cadastro)
    const availableCarModels = [
        'Lecar 459',
        'Lecar Campo',
    ];

    // --- Funções Auxiliares ---

    // Função para gerar um ID único simples (para novos clientes)
    function generateUniqueId() {
        return 'user' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Função para gerar um código de barras simulado (apenas uma string aleatória)
    function generateBarCode() {
        return Array(47).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    }

    // Função para gerar uma URL de banco simulada
    function generateBankPaymentUrl(boletoId, clientName, value) {
        // Exemplo: https://banco-fake.com/pagar?boleto=XYZ&cliente=ABC&valor=123.45
        return `https://banco.lecar.com/pagar?boleto=${boletoId}&cliente=${encodeURIComponent(clientName)}&valor=${value.toFixed(2)}`;
    }

    // --- Funções do Dashboard ---

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
                    matchesPaymentStatus = (totalPaid === totalInstallments && totalInstallments > 0); // Considera que pagou tudo se não há parcelas ou todas pagas
                } else if (selectedPaymentStatus === 'pending') {
                    matchesPaymentStatus = (totalPaid < totalInstallments);
                }
            }
            return matchesSearch && matchesCarModel && matchesPaymentStatus;
        });

        clientsUl.innerHTML = '';

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

    // Função para preencher o filtro de modelos de carro E o select do novo cliente
    function populateCarModelFilters() {
        const uniqueCarModels = [...new Set(demoClients.map(client => client.carModel).concat(availableCarModels))];
        uniqueCarModels.sort();

        // Limpa e preenche o filtro de busca no dashboard
        carModelFilter.innerHTML = '<option value="all">Filtrar por Carro (Todos)</option>';
        uniqueCarModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            carModelFilter.appendChild(option);
        });

        // Limpa e preenche o select de cadastro de novo cliente
        newClientCarModelSelect.innerHTML = '<option value="">Selecione um carro</option>';
        availableCarModels.sort().forEach(model => { // Usa apenas os modelos "disponíveis" para cadastro
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            newClientCarModelSelect.appendChild(option);
        });
    }

    function updateDashboardSummary() {
        let totalPaid = 0;
        let totalPending = 0;
        const salesByCarModel = {};

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

    function renderPaymentChart(data) {
        const labels = Object.keys(data);
        const paidData = labels.map(model => data[model].paid);
        const pendingData = labels.map(model => data[model].pending);

        if (paymentChartInstance) {
            paymentChartInstance.destroy();
        }

        paymentChartInstance = new Chart(paymentChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Recebido',
                        data: paidData,
                        backgroundColor: 'rgba(40, 167, 69, 0.7)',
                        borderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Total Pendente',
                        data: pendingData,
                        backgroundColor: 'rgba(220, 53, 69, 0.7)',
                        borderColor: 'rgba(220, 53, 69, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true,
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

    // --- Funções de Login/Logout e Modal de Pagamento ---

    loginButton.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === 'teste@lecar.com' && password === 'lecar123') {
            loginScreen.classList.remove('active');
            dashboardScreen.classList.add('active');
            populateCarModelFilters(); // Popula ambos os filtros/selects
            updateDashboardSummary();
            renderClientList();
        } else {
            alert('Email ou senha inválidos. Use: teste@lecar.com / lecar123');
        }
    });

    logoutButton.addEventListener('click', () => {
        dashboardScreen.classList.remove('active');
        loginScreen.classList.add('active');
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        clientsUl.innerHTML = '';
        clientSearchInput.value = '';
        carModelFilter.value = 'all';
        paymentStatusFilter.value = 'all';
        if (paymentChartInstance) {
            paymentChartInstance.destroy();
            paymentChartInstance = null;
        }
    });

    // Abre o modal de detalhes de pagamento
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

    // Renderiza os boletos (pagos e pendentes) com link/código de barras
    function renderBoletos() {
        boletoStatusContainer.innerHTML = '';
        currentClientData.payments.installments.forEach(boleto => {
            const boletoDiv = document.createElement('div');
            boletoDiv.classList.add('boleto-item');
            boletoDiv.classList.add(boleto.paid ? 'paid' : 'pending');

            const barcode = generateBarCode(); // Gera um código de barras simulado
            const paymentUrl = generateBankPaymentUrl(boleto.id, currentClientData.name, boleto.value); // Gera URL de pagamento simulada

            boletoDiv.innerHTML = `
                <span>Boleto ${boleto.id}</span>
                <span>R$ ${boleto.value.toFixed(2).replace('.', ',')}</span>
                <span>${boleto.paid ? 'Pago' : 'Pendente'}</span>
                ${boleto.paid ? `<span>${boleto.date}</span>` :
                    `<a href="${paymentUrl}" target="_blank" class="boleto-link" title="Copiar código: ${barcode}">Link de Pagamento</a>
                     <span class="barcode-copy-hint" style="font-size: 0.6em; cursor: pointer;" data-barcode="${barcode}">Copiar Cód. Barras</span>`
                }
            `;
            boletoStatusContainer.appendChild(boletoDiv);

            // Adiciona evento para copiar código de barras
            if (!boleto.paid) {
                const copyHint = boletoDiv.querySelector('.barcode-copy-hint');
                if (copyHint) {
                    copyHint.addEventListener('click', (e) => {
                        e.stopPropagation(); // Evita que clique no boleto inteiro
                        const code = copyHint.dataset.barcode;
                        navigator.clipboard.writeText(code).then(() => {
                            alert(`Código de barras copiado: ${code}`);
                        }).catch(err => {
                            console.error('Falha ao copiar texto: ', err);
                            alert(`Falha ao copiar. Código de barras: ${code}`);
                        });
                    });
                }
            }
        });
    }

    // Renderiza os boletos para seleção de antecipação (mantido o mesmo)
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
            
            renderClientList();
            updateDashboardSummary();
        }, 2000);
    });

    // --- Lógica para o NOVO MODAL de Cadastro de Cliente ---

    newClientButton.addEventListener('click', () => {
        // Limpa o formulário ao abrir
        newClientForm.reset();
        newClientModal.classList.add('active');
        populateCarModelFilters(); // Garante que o select de carros esteja atualizado
    });

    // Lógica para fechar os modais genérica
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modalId = e.target.dataset.modalId;
            document.getElementById(modalId).classList.remove('active');
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === paymentDetailsModal) {
            paymentDetailsModal.classList.remove('active');
        }
        if (event.target === newClientModal) {
            newClientModal.classList.remove('active');
        }
    });

    newClientForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário

        const name = newClientNameInput.value.trim();
        const cpf = newClientCpfInput.value.trim();
        const carModel = newClientCarModelSelect.value;
        const totalInstallments = parseInt(newClientInstallmentsInput.value, 10);
        const installmentValue = parseFloat(newClientInstallmentValueInput.value);
        const dueDateDay = parseInt(newClientDueDateInput.value, 10);

        // Validações básicas
        if (!name || !cpf || !carModel || isNaN(totalInstallments) || totalInstallments <= 0 ||
            isNaN(installmentValue) || installmentValue <= 0 || isNaN(dueDateDay) || dueDateDay < 1 || dueDateDay > 31) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const newClientId = generateUniqueId();
        const installments = [];
        const currentDate = new Date();

        for (let i = 0; i < totalInstallments; i++) {
            const installmentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, dueDateDay);
            // Ajusta o dia se for inválido para o mês (ex: dia 31 em fev)
            if (installmentDate.getDate() !== dueDateDay) {
                installmentDate.setDate(0); // Último dia do mês anterior
                installmentDate.setDate(dueDateDay); // Tenta o dia de vencimento novamente
                if (installmentDate.getDate() !== dueDateDay) { // Se ainda for diferente, vai para o último dia do mês
                    installmentDate.setDate(0); // Último dia do mês anterior
                    installmentDate.setDate(0); // Último dia do mês do vencimento
                }
            }
            
            installments.push({
                id: i + 1,
                value: installmentValue,
                paid: false, // Todos os boletos de novo cliente começam como pendentes
                date: installmentDate.toISOString().split('T')[0] // Formato YYYY-MM-DD
            });
        }

        const newClient = {
            id: newClientId,
            name: name,
            cpf: cpf,
            carModel: carModel,
            payments: {
                method: 'Bolepix',
                totalInstallments: totalInstallments,
                installments: installments
            }
        };

        demoClients.push(newClient); // Adiciona o novo cliente aos dados de demonstração

        alert(`Cliente ${name} cadastrado com sucesso!`);
        newClientModal.classList.remove('active'); // Fecha o modal
        renderClientList(); // Atualiza a lista de clientes
        updateDashboardSummary(); // Atualiza o resumo e o gráfico
        populateCarModelFilters(); // Garante que o filtro de carros seja atualizado se houver um novo modelo
    });


    // --- Event Listeners para busca e filtros ---
    clientSearchInput.addEventListener('input', renderClientList);
    carModelFilter.addEventListener('change', renderClientList);
    paymentStatusFilter.addEventListener('change', renderClientList);

    // Inicia na tela de login
    loginScreen.classList.add('active');
});
