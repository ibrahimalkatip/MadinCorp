const devCardsContainer = document.getElementById('dev-cards');
const loadingElement = document.getElementById('loading');

loadingElement.style.display = 'block';

fetch('https://filltext.com/?rows=1000&fname={firstName}&lname={lastName}&category=[%22cat1%22,%22cat2%22,%22cat3%22]&pretty=true')
    .then(response => response.json())
    .then(data => {
        loadingElement.style.display = 'none';

        function createDevCard(dev) {
            const { fname, lname, category } = dev;

            const devCard = document.createElement('div');
            devCard.className = 'dev-card';
            devCard.innerHTML = `
    <img src="https://via.placeholder.com/80" alt="Profile Image" class="img-6x6">
    <div class="dev-card-details">
      <h3>${fname} ${lname}</h3>
      <p>Category: ${category}</p>
    </div>
  `;

            devCardsContainer.appendChild(devCard);
        }

        function populateDevCards(data) {
            devCardsContainer.innerHTML = '';

            data.forEach(dev => {
                createDevCard(dev);
            });
        }

        populateDevCards(data);
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.addEventListener('change', () => {
            const selectedCategories = Array.from(categoryFilter.options)
                .filter(option => option.selected && option.value !== 'all')
                .map(option => option.value);

            let filteredData = data;

            if (selectedCategories.length > 0) {
                filteredData = data.filter(dev => {
                    return selectedCategories.some(category => dev.category.includes(category));
                });
            }

            populateDevCards(filteredData);
        });



        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', () => {
            const searchText = searchInput.value.toLowerCase();

            const categoryFilter = document.getElementById('category-filter');
            const selectedCategory = categoryFilter.value;

            let filteredData = data;

            if (selectedCategory !== 'all') {
                filteredData = data.filter(dev => dev.category === selectedCategory);
            }

            filteredData = filteredData.filter(dev => {
                const fullName = `${dev.fname.toLowerCase()} ${dev.lname.toLowerCase()}`;
                const category = dev.category.toLowerCase();
                return fullName.includes(searchText) || category.includes(searchText);
            });

            populateDevCards(filteredData);
        });





        const toggleIcon = document.querySelector('.material-icons');
        toggleIcon.addEventListener('click', () => {
            const devCardImages = document.querySelectorAll('.dev-card img');
            devCardImages.forEach(img => {
                img.classList.toggle('img-6x6');
                img.classList.toggle('img-8x8');
            });
        });
    })
    .catch(error => {
        loadingElement.style.display = 'none';
        console.log('Error:', error);
    });