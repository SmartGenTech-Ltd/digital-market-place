document.addEventListener("DOMContentLoaded", () => {
    // Éléments du DOM
    const loginBtn = document.getElementById('loginBtn');
    const trialBtn = document.getElementById('trialBtn');
    const heroGetStarted = document.getElementById('heroGetStarted');
    const loginModal = document.getElementById('loginModal');
    const paymentModal = document.getElementById('paymentModal');
    const adminDashboard = document.getElementById('adminDashboard');
    const adminToggleBtn = document.getElementById('adminToggleBtn');
    const backToSite = document.getElementById('backToSite');
    const closeBtns = document.querySelectorAll('.close');

    // Tableaux et données de gestion Admin en mémoire locale (LocalStorage)
    let clientsData = JSON.parse(localStorage.getItem('admin_clients')) || [
        { name: "Utilisateur Test", email: "client@example.com", plan: "Creator ($25)", status: "Actif" }
    ];

    // Mise à jour initiale de l'interface admin
    updateAdminUI();

    // 1. Gestion des ouvertures de modales
    if(loginBtn) loginBtn.addEventListener('click', () => loginModal.style.display = 'flex');
    
    if(trialBtn) trialBtn.addEventListener('click', () => {
        document.getElementById('selectedPlanText').innerText = "Activation du plan Creator ($25 / mois)";
        paymentModal.style.display = 'flex';
    });

    if(heroGetStarted) {
        heroGetStarted.addEventListener('click', () => {
            const emailInput = document.getElementById('heroEmail');
            const email = emailInput ? emailInput.value : '';
            if(email) {
                document.getElementById('selectedPlanText').innerText = `Enregistrement pour : ${email}`;
                paymentModal.style.display = 'flex';
            } else {
                alert("Veuillez entrer une adresse email valide !");
            }
        });
    }

    // Gestion des boutons "Select Plan" (Free ou Creator) sur la page
    document.querySelectorAll('.select-plan').forEach(button => {
        button.addEventListener('click', (e) => {
            const plan = e.target.getAttribute('data-plan') || "Plan Standard";
            document.getElementById('selectedPlanText').innerText = `Plan sélectionné : ${plan}`;
            paymentModal.style.display = 'flex';
        });
    });

    // 2. Fermeture des modales
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if(loginModal) loginModal.style.display = 'none';
            if(paymentModal) paymentModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === paymentModal) paymentModal.style.display = 'none';
    });

    // 3. Soumission du formulaire de Connexion (Login)
    const formLogin = document.getElementById('formLogin');
    if(formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            alert(`Connexion réussie ! Bienvenue de retour, ${email}`);
            if(loginModal) loginModal.style.display = 'none';
            if(adminToggleBtn) adminToggleBtn.style.display = 'flex'; // Affiche l'accès Admin
        });
    }

    // 4. Soumission du paiement / Enregistrement bancaire (Start Free Trial)
    const formPayment = document.getElementById('formPayment');
    if(formPayment) {
        formPayment.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Paiement / Carte bancaire enregistrés avec succès ! Votre essai est activé.");
            
            // Ajout dynamique du client dans l'espace Admin
            clientsData.push({
                name: "Nouveau Client",
                email: "client.abonne@domain.com",
                plan: "Creator ($25)",
                status: "Actif"
            });
            saveAndRefreshAdmin();

            if(paymentModal) paymentModal.style.display = 'none';
            if(adminToggleBtn) adminToggleBtn.style.display = 'flex'; // Débloque le bouton admin
        });
    }

    // 5. Basculement vers l'Espace Admin
    if(adminToggleBtn) {
        adminToggleBtn.addEventListener('click', () => {
            if(adminDashboard) adminDashboard.style.display = 'block';
        });
    }

    if(backToSite) {
        backToSite.addEventListener('click', (e) => {
            e.preventDefault();
            if(adminDashboard) adminDashboard.style.display = 'none';
        });
    }

    // Fonctions utilitaires Admin
    function saveAndRefreshAdmin() {
        localStorage.setItem('admin_clients', JSON.stringify(clientsData));
        updateAdminUI();
    }

    function updateAdminUI() {
        const tableBody = document.getElementById('adminTableBody');
        const usersCount = document.getElementById('adminUsersCount');
        const revenueCount = document.getElementById('adminRevenue');

        if(usersCount) usersCount.innerText = clientsData.length;
        if(revenueCount) {
            const totalRev = clientsData.length * 25;
            revenueCount.innerText = `$${totalRev}.00`;
        }

        if(tableBody) {
            tableBody.innerHTML = '';
            clientsData.forEach((client, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><strong>${client.name}</strong><br><small style="color:#64748b">${client.email}</small></td>
                    <td>${client.plan}</td>
                    <td><span class="badge active" style="background:#dcfce7; color:#16a34a; padding:4px 8px; border-radius:4px;">${client.status}</span></td>
                    <td><button class="btn-danger" onclick="window.deleteClient(${index})">Supprimer</button></td>
                `;
                tableBody.appendChild(row);
            });
        }
    }

    // Fonction globale pour supprimer un client depuis le tableau admin
    window.deleteClient = function(index) {
        if(confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
            clientsData.splice(index, 1);
            saveAndRefreshAdmin();
        }
    }
});