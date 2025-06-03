import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm'

// Initialize Supabase client with additional options
const supabaseUrl = 'https://jyailcsclxjzcnyrnsic.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5YWlsY3NjbHhqemNueXJuc2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjM1OTksImV4cCI6MjA2MTM5OTU5OX0.TVh104V8SnfeRTWywzYU96j-7uKtbzX6Tf8kjQbPwKk'
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    },
    headers: {
        'Content-Type': 'application/json'
    }
})

document.addEventListener('DOMContentLoaded', async function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab') === 'fresh' ? 'freshEntry' : 'editEntry';
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Fresh Data Entry Form handling
    const freshDataForm = document.getElementById('freshDataForm');
    if (freshDataForm) {
        freshDataForm.addEventListener('submit', handleFreshDataSubmit);
        console.log('Fresh data form handler attached'); // Debug log
    } else {
        console.error('Fresh data form not found'); // Debug log
    }

    // Edit Work Details Form handling
    const searchForm = document.getElementById('searchForm');
    const editForm = document.getElementById('editForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearchSubmit);
        console.log('Search form handler attached'); // Debug log
    } else {
        console.error('Search form not found'); // Debug log
    }

    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
        console.log('Edit form handler attached'); // Debug log
    } else {
        console.error('Edit form not found'); // Debug log
    }

    // Test Supabase connection on page load
    try {
        const { data, error } = await supabase
            .from('work_details')
            .select('count(*)', { count: 'exact' });
        
        if (error) throw error;
        console.log('Successfully connected to Supabase');
    } catch (error) {
        console.error('Supabase connection error:', error);
    }

    // Village data mapping
    const villagesByTaluka = {
        'Gandhinagar': ["Adalaj","Adraj Moti","Alampur","Bhoyan Rathod","Bhundiya -Dharampur","Chandrala","Chekhalarani","Chhala","Chiloda - Dabhoda",
"Dabhoda","Dantali","Dashela","Dhanap","Dolarana Vasana", "Galudan","Giyod","Isanpur Mota","Jakhora - Rajpur","Jalund","Jamiyatpur",
"Kakanu Tarapur","Kanpur","Lavarpur","Lekawada","Limbadia-Karai","Madhavgadh","Magodi","Mahudara","Medra","Motipura","Mubarakpura",
"Palaj","Pindharada","Piplaj","Pirojpur","Prantiya","Pundarasan","Raipur","Ranasan","Ratanpur","Rupal","Sadra","Sardhav","Shahpur","Shertha","Shiholi Moti","Sonarda","Sonipur",
"Tarapur","Titoda","Unava","Uvarsad","Vadodara","Vaja Pura","Valad","Vankanerda","Vasan","Vira Talavdi",],
        'Mansa': ["Ajarapura","Ajol","Aluva","Amaja","Amarapur","Amarpura (Kh)","Ambod","Anandpura Ambod","Anandpura (Solaiya)","Anandpura Veda",
"Anguthala","Anodiya","Badpura","Baliyanagar (M)","Balva","Bapupura","Bhimpura (M)","Bilodra","Boru","Chadasna","Chandisana","Charada",
"Delvad","Dhameda","Dhendhu","Dholakuva","Dodipal","Fatehpura","Galthara","Govindpura (Samo)","Gulabpura","Gunma","Hanumanpura (Samau)",
"Harna Hoda","Himmatpura (B)","Himmatpura (L)","Indrapura","Iswerpura","Itadra","Itla","Jamla","Khadat","Kharna","Khata Aamba",
"Kotvas","Kunvadara","Lakroda","Limbodara","Lodra","Mahudi","Makakhad","Mandali(V)","Manekpura (Makakhad)","Maninagar (Soja)",
"Motipura (Veda)","Nadri","Padusma","Paladi Rathod","Paladi (Vyas)","Parbatpura","Parsa","Patanpura","Pratap Nagar","Pratappura (Balva)",
"Pratappura (Piyaj)","Prempura Veda","Pundhara","Rajpura","Rampura","Rangpur","Ridrol","Samou","Sobhasan","Soja","Solaiya",
"Umiyanagar","Umiyanagar (B)","Vagosana","Varsoda","Veda","Vihar","Vijayanagar"],
        'Kalol': ["Adhana","Arsodiya","Bhadol","Bhavpura","Bhimasan","Bhoyan Moti","Bileshvarpura","Borisana","Chhatral","Dantali",
"Dhamasna","Dhanaj","Dhanot","Dingucha","Ganpatpura","Golthara","Govindpura (Veda)","Hajipur","Himmatpura (Veda)","Isand","Jaspur",
"Jethlaj","Kantha","Karoli","Khatrajdabhi","Mokhasan","Mulasana","Nandoli","Nardipur","Nasmed","Nava","Ola","Paliyad",
"Palodiya","Palsana","Pansar","Piyaj","Rakanpur","Ramnagar","Rancharada","Ranchhodpura","Sabaspur","Saij","Sanavad","Santej",
"Sherisa","Unali","Usmanabad","Vadavsvami","Vadsar","Vansajada Dhedia","Vansajada (K)","Vayana","Veda"
],
        'Dahegam': ["Aantroli","Ahamadpur","Amrajina Muvada","Antoli","Arajanjina Muvada","Babra","Badpur","Bahiyal","Bardoli (Bariya)",
"Bardoli (Kothi)","Bariya","Bhadroda","Bilamana","Chamla","Chekhlapagi","Chiskari","Demaliya","Devkaran Na Muvada","Dhaniyol",
"Dharisana","Dod","Dumecha","Ghamij","Halisa","Harakhjina Muvada","Harsoli-Jivajini Muvadi","Harsoli-Jivajini Muvadi","Hathijan",
"Hilol","Hilol Vasna","Isanpur Dodiya","Jaliya Math","Jalundra Mota","Jalundra Nana","Jesa Chandna Muvada","Jindva","Jindva",
"Jivraj Na Muvada","Kadadara","Kadjodra","Kalyanji Na Muvada","Kamalbandh Vasna","Kanipur","Kantharpur","Karoli","Khadiya - Thadakuva",
"Khadiya - Thadakuva","Khakhara","Khanpur","Kodrali","Krishnanagar","Lakha Na Muvada","Lavad","Lihoda","Mirapur","Mithana Muvada",
"Morali","Mosampur","Moti-Nani Machhang","Moti-Nani Machhang","Motipura","Motipura","Nagjina Muvada","Nandol","Narnavat (Khapreswar)",
"Navanagar","Ottampur","Pahadiya","Pahadiya","Palaiya","Pallano Math","Palundra","Panana Muvada","Pasuniya","Patna Kuva","Pavthi-Najupura",
"Pavthi-Najupura","Pavthi-Najupura","Piplaj","Rakhiyal","Ramnagar","Sagdalpur","Sahebji Na Muvada","Salki","Sametri","Sampa",
"Sanoda","Shiyapura","Shiyavada","Udan","Vadod","Vadvasa","Vardhana Muvada","Vasana Chaudhary","Vasna Rathod","Vasna Sogthi",
"Vatva","Velpura","Zalana Muvada","Zank"]
    };

    // Get the select elements
    const talukaSelect = document.getElementById('talukaName');
    const villageSelect = document.getElementById('villageName');

    // Function to update village options
    function updateVillages(selectedTaluka) {
        console.log('Selected taluka:', selectedTaluka); // Debug log

        // Clear existing options
        villageSelect.innerHTML = '<option value="" disabled selected>Select a village</option>';

        // Add new options based on selected taluka
        if (selectedTaluka && villagesByTaluka[selectedTaluka]) {
            console.log('Found villages for taluka:', villagesByTaluka[selectedTaluka]); // Debug log
            villagesByTaluka[selectedTaluka].forEach(village => {
                const option = document.createElement('option');
                option.value = village;
                option.textContent = village; // Remove charAt manipulation as villages are already properly cased
                villageSelect.appendChild(option);
            });
        } else {
            console.log('No villages found for taluka:', selectedTaluka); // Debug log
        }
    }

    // Add event listener for taluka selection
    talukaSelect.addEventListener('change', function() {
        console.log('Taluka changed to:', this.value);
        console.log('Available talukas:', Object.keys(villagesByTaluka));
        updateVillages(this.value);
    });
});

async function handleFreshDataSubmit(e) {
    e.preventDefault();
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        // Get the values to check
        const year = document.getElementById('year').value;
        const scheme = document.getElementById('scheme').value;
        const workId = document.getElementById('workId').value;

        // Check if entry already exists
        const { data: existingData, error: checkError } = await supabase
            .from('work_details')
            .select('id')
            .eq('year', year)
            .eq('scheme', scheme)
            .eq('work_id', workId);

        if (checkError) throw checkError;

        if (existingData && existingData.length > 0) {
            alert('A work entry with this Year, Scheme and Work ID combination already exists!');
            return;
        }

        const formData = {
            scheme: scheme,
            year: year,
            work_id: workId,
            taluka_name: document.getElementById('talukaName').value,
            village_name: document.getElementById('villageName').value,
            work_type: document.getElementById('workType').value,
            work_name: document.getElementById('workName').value,
            amount: parseFloat(document.getElementById('amount').value),
            primary_approval_date: document.getElementById('primaryApprovalDate').value,
            technical_approval_date: null,
            administrative_approval_date: null,
            work_completion_date: null
        };

        const { error: insertError } = await supabase
            .from('work_details')
            .insert([formData]);

        if (insertError) {
            if (insertError.code === '23505') { // Postgres unique violation code
                alert('A work entry with this Year, Scheme and Work ID combination already exists!');
                return;
            }
            throw insertError;
        }

        alert('Data submitted successfully!');
        e.target.reset();
    } catch (error) {
        console.error('Submission error:', error);
        alert(`Failed to submit data: ${error.message}`);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
}

async function handleSearchSubmit(e) {
    e.preventDefault();
    console.log('Search form submitted'); // Debug log
    
    try {
        const scheme = document.getElementById('editScheme').value;
        const year = document.getElementById('editYear').value;
        const workId = document.getElementById('editWorkId').value;

        console.log('Searching for:', { scheme, year, workId }); // Debug log

        const { data, error } = await supabase
            .from('work_details')
            .select('*')
            .eq('scheme', scheme)
            .eq('year', year)
            .eq('work_id', workId)
            .single();

        if (error) throw error;

        if (data) {
            console.log('Found data:', data); // Debug log
            populateEditForm(data);
            document.getElementById('editForm').style.display = 'block';
        } else {
            alert('No work details found with the provided information.');
        }
    } catch (error) {
        console.error('Search error:', error);
        alert(`Failed to fetch data: ${error.message}`);
    }
}

function generateTalukaOptions(selectedTaluka) {
    const talukas = ['Gandhinagar', 'Mansa', 'Dahegam', 'Kalol'];
    return talukas
        .map(taluka => `<option value="${taluka}" ${taluka === selectedTaluka ? 'selected' : ''}>${taluka}</option>`)
        .join('');
}

function populateEditForm(data) {
    editForm.innerHTML = `
        <h2>Edit Work Details</h2>
        <input type="hidden" id="editId" value="${data.id}">
        
        <label for="editScheme">Scheme:</label>
        <select id="editScheme" name="scheme" required>
            <option value="finance_commission" ${data.scheme === 'finance_commission' ? 'selected' : ''}>Finance Commission Scheme</option>
            <option value="stamp_duty" ${data.scheme === 'stamp_duty' ? 'selected' : ''}>Stamp Duty Scheme</option>
            <option value="sand_gravel" ${data.scheme === 'sand_gravel' ? 'selected' : ''}>Sand Gravel Scheme</option>
        </select>

        <label for="editYear">Year:</label>
        <input type="text" id="editYear" name="year" value="${data.year}" required>

        <label for="editWorkId">Work ID:</label>
        <input type="text" id="editWorkId" name="workId" value="${data.work_id}" required>
        
        <label for="editTalukaName">Taluka Name:</label>
        <select id="editTalukaName" name="taluka_name" required>
            ${generateTalukaOptions(data.taluka_name)}
        </select>

        <label for="editVillageName">Village Name:</label>
        <select id="editVillageName" name="village_name" required>
            <option value="${data.village_name}" selected>${data.village_name}</option>
        </select>

        <label for="editWorkType">Work Type:</label>
        <select id="editWorkType" name="work_type" required>
            <option value="cc_road" ${data.work_type === 'cc_road' ? 'selected' : ''}>CC Road</option>
            <option value="paver_block" ${data.work_type === 'paver_block' ? 'selected' : ''}>Paver Block</option>
            <option value="drainage_work" ${data.work_type === 'drainage_work' ? 'selected' : ''}>Drainage Work</option>
        </select>

        <label for="editWorkName">Work Name:</label>
        <input type="text" id="editWorkName" name="work_name" value="${data.work_name}" required>

        <label for="editAmount">Amount:</label>
        <input type="number" id="editAmount" name="amount" value="${data.amount}" required>

        <label for="editPrimaryApprovalDate">Primary Approval Date:</label>
        <input type="date" id="editPrimaryApprovalDate" name="primary_approval_date" value="${data.primary_approval_date}" required>

        <label for="editTechnicalApprovalDate">Technical Approval Date:</label>
        <input type="date" id="editTechnicalApprovalDate" name="technical_approval_date" value="${data.technical_approval_date || ''}">

        <label for="editAdministrativeApprovalDate">Administrative Approval Date:</label>
        <input type="date" id="editAdministrativeApprovalDate" name="administrative_approval_date" value="${data.administrative_approval_date || ''}">

        <label for="editWorkCompletionDate">Work Completion Date:</label>
        <input type="date" id="editWorkCompletionDate" name="work_completion_date" value="${data.work_completion_date || ''}">

        <button type="submit">Update Details</button>
        <button type="button" onclick="cancelEdit()">Cancel</button>
    `;

    // Add event listener for taluka change in edit form
    const editTalukaSelect = document.getElementById('editTalukaName');
    editTalukaSelect.addEventListener('change', function() {
        updateVillages(this.value);
    });
}

// Add cancel function
window.cancelEdit = function() {
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('searchForm').reset();
}

async function handleEditSubmit(e) {
    e.preventDefault();
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Updating...';
    
    try {
        const formData = {
            scheme: document.getElementById('editScheme').value,
            year: document.getElementById('editYear').value,
            work_id: document.getElementById('editWorkId').value,
            taluka_name: document.getElementById('editTalukaName').value,
            village_name: document.getElementById('editVillageName').value,
            work_type: document.getElementById('editWorkType').value,
            work_name: document.getElementById('editWorkName').value,
            amount: parseFloat(document.getElementById('editAmount').value),
            primary_approval_date: document.getElementById('editPrimaryApprovalDate').value,
            technical_approval_date: document.getElementById('editTechnicalApprovalDate').value || null,
            administrative_approval_date: document.getElementById('editAdministrativeApprovalDate').value || null,
            work_completion_date: document.getElementById('editWorkCompletionDate').value || null
        };

        const { error } = await supabase
            .from('work_details')
            .update(formData)
            .eq('id', document.getElementById('editId').value);

        if (error) throw error;

        alert('Work details updated successfully!');
        document.getElementById('editForm').style.display = 'none';
        document.getElementById('searchForm').reset();
    } catch (error) {
        console.error('Update error:', error);
        alert(`Failed to update data: ${error.message}`);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Update Details';
    }
}