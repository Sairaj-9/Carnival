<template>
  <div class="app-shell">
    <header class="hero" id="top">
      <div class="hero-backdrop" aria-hidden="true">
        <img
          v-for="(image, index) in heroImages"
          :key="image"
          class="hero-image"
          :class="{ visible: currentHero === index }"
          :src="image"
          :alt="index === currentHero ? restaurant.name + ' food' : ''"
          loading="lazy"
          decoding="async"
          :style="{ transform: 'translateY(' + heroOffset + 'px) scale(1.12)' }"
        />
      </div>
      <div class="hero-shade"></div>

      <div class="hero-content">
        <div class="hero-brand">
          <div class="logo-mark" aria-hidden="true"><span>C</span></div>
          <p class="eyebrow">Sawarde · Since always, with love</p>
        </div>
        <h1>{{ restaurant.name || 'The Carnival Restaurant' }}</h1>
        <p class="hero-tagline">{{ restaurant.cuisines.join(' | ') }}</p>
        <p class="hero-copy">A little spice, a lot of heart.</p>
        <div class="hero-actions">
          <a class="button button-orange" href="#menu" @click.prevent="scrollToMenu">View Menu <span aria-hidden="true">↓</span></a>
          <a class="button button-glass" :href="phoneLink">Call Now <span aria-hidden="true">↗</span></a>
          <a
            class="button button-glass"
            href="https://www.google.com/maps?cid=12381897431713129189"
            target="_blank"
            rel="noopener noreferrer"
          >
            Directions <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div class="hero-pager" aria-label="Hero image slides">
          <button
            v-for="(image, index) in heroImages"
            :key="image"
            type="button"
            :class="{ selected: currentHero === index }"
            :aria-label="'Show food image ' + (index + 1)"
            :aria-pressed="currentHero === index"
            @click="currentHero = index"
          ></button>
        </div>
        <span class="hero-scroll-hint" aria-hidden="true">Scroll to explore <span>↓</span></span>
      </div>
    </header>

    <main>
      <section class="specials-section page-width reveal" aria-labelledby="specials-title">
        <div class="section-topline">
          <div>
            <p class="eyebrow">Straight from our favourites</p>
            <h2 id="specials-title" class="brush-title">Carnival Specials</h2>
          </div>
          <div class="carousel-controls" v-if="specialItems.length > 1">
            <button type="button" aria-label="Scroll specials left" @click="scrollSpecials(-1)">←</button>
            <button type="button" aria-label="Scroll specials right" @click="scrollSpecials(1)">→</button>
          </div>
        </div>

        <div ref="specialTrack" class="specials-track" aria-label="Carnival special dishes">
          <article v-for="special in specialItems" :key="special.category + special.item.name" class="special-card">
            <img
              v-if="special.image"
              :src="special.image"
              :alt="special.category + ' menu selection'"
              loading="lazy"
              decoding="async"
            />
            <div v-else class="photo-placeholder"></div>
            <div class="special-card-shade"></div>
            <div class="special-card-copy">
              <span class="special-kicker">Carnival Special</span>
              <h3>{{ special.item.name }}</h3>
              <p>{{ priceText(special.item) }}</p>
              <button type="button" class="text-link" @click="scrollToCategory(special.category)">
                Find it on the menu <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
          <p v-if="!specialItems.length && !loading" class="empty-specials">Our special picks are being prepared.</p>
        </div>
      </section>

      <section class="showcase-section page-width reveal" aria-labelledby="showcase-title">
        <div class="section-topline showcase-heading">
          <div>
            <p class="eyebrow">Find your next favourite</p>
            <h2 id="showcase-title" class="brush-title">Explore the menu</h2>
          </div>
          <p class="section-aside">{{ categories.length }} delicious ways to begin.</p>
        </div>

        <div v-if="loading" class="category-showcase skeleton-grid" aria-label="Loading menu categories">
          <div v-for="number in 6" :key="number" class="skeleton category-skeleton"></div>
        </div>
        <div v-else class="category-showcase">
          <button
            v-for="category in categories"
            :key="category.name"
            type="button"
            class="showcase-card reveal"
            @click="scrollToCategory(category.name)"
          >
            <img
              v-if="category.image"
              :src="category.image"
              :alt="category.name + ' dishes'"
              loading="lazy"
              decoding="async"
            />
            <div v-else class="photo-placeholder"></div>
            <span class="showcase-overlay"></span>
            <span class="showcase-content">
              <span class="showcase-count">{{ itemCount(category) }} items</span>
              <strong>{{ category.name }}</strong>
              <span class="showcase-arrow" aria-hidden="true">↗</span>
            </span>
          </button>
        </div>
      </section>

      <nav v-if="categories.length" class="category-nav" aria-label="Jump to a menu category">
        <div class="category-nav-inner">
          <button
            v-for="category in categories"
            :key="category.name"
            type="button"
            class="category-chip"
            :class="{ active: activeCategory === categoryId(category.name) }"
            :aria-current="activeCategory === categoryId(category.name) ? 'location' : null"
            @click="scrollToCategory(category.name)"
          >
            <span class="chip-image">
              <img v-if="category.image" :src="category.image" :alt="''" loading="lazy" decoding="async" />
              <span v-else>{{ category.name.charAt(0) }}</span>
            </span>
            <span>{{ category.name }}</span>
          </button>
        </div>
      </nav>

      <section id="menu" class="menu-section page-width" aria-labelledby="menu-title">
        <div class="menu-intro reveal">
          <div>
            <p class="eyebrow">A table full of good things</p>
            <h2 id="menu-title" class="brush-title">The Menu</h2>
          </div>
          <p class="menu-intro-note">Freshly made. Happily shared.</p>
        </div>

        <div class="search-panel">
          <label class="search-box">
            <span class="search-icon" aria-hidden="true">⌕</span>
            <span class="visually-hidden">Search dishes and categories</span>
            <input v-model.trim="searchTerm" type="search" placeholder="Search dishes or categories" autocomplete="off" />
            <button v-if="searchTerm" type="button" class="clear-search" aria-label="Clear search" @click="searchTerm = ''">×</button>
          </label>
          <div class="filter-group" role="group" aria-label="Filter menu by diet">
            <button
              v-for="option in filters"
              :key="option.value"
              type="button"
              class="filter-pill"
              :class="{ selected: selectedFilter === option.value }"
              :aria-pressed="selectedFilter === option.value"
              @click="selectedFilter = option.value"
            >
              <span v-if="option.value !== 'all'" class="diet-dot" :class="option.value === 'veg' ? 'veg-dot' : 'nonveg-dot'"></span>
              {{ option.label }}
            </button>
          </div>
        </div>

        <p v-if="loading" class="loading-message" role="status">Setting the table…</p>
        <p v-else-if="loadError" class="message-card error-message" role="alert">{{ loadError }}</p>
        <p v-else-if="!visibleCategories.length" class="message-card" role="status">
          No dishes match that search. Try another dish or filter.
        </p>

        <div v-else class="menu-list">
          <section
            v-for="category in visibleCategories"
            :id="categoryId(category.name)"
            :key="category.name"
            class="menu-category reveal"
            :aria-labelledby="categoryId(category.name) + '-heading'"
          >
            <div class="category-banner">
              <img
                v-if="category.image"
                :src="category.image"
                :alt="category.name + ' dishes from The Carnival Restaurant'"
                loading="lazy"
                decoding="async"
              />
              <div v-else class="photo-placeholder"></div>
              <div class="category-banner-shade"></div>
              <div class="category-banner-copy">
                <p class="eyebrow">{{ itemCount(category) }} dishes to discover</p>
                <h2 :id="categoryId(category.name) + '-heading'" class="brush-title">{{ category.name }}</h2>
              </div>
            </div>

            <div class="sections-grid">
              <section v-for="section in category.sections" :key="section.label" class="menu-subsection">
                <div class="subsection-visual">
                  <img
                    v-if="section.image || category.image"
                    :src="section.image || category.image"
                    :alt="section.label + ' ' + category.name + ' selection'"
                    loading="lazy"
                    decoding="async"
                  />
                  <div v-else class="photo-placeholder"></div>
                  <div class="subsection-shade"></div>
                  <h3>{{ section.label }}</h3>
                </div>
                <div class="dish-grid">
                  <article v-for="item in section.items" :key="item.name" class="dish-card">
                    <div class="dish-title-row">
                      <span class="diet-dot" role="img" :class="item.veg ? 'veg-dot' : 'nonveg-dot'" :aria-label="item.veg ? 'Vegetarian' : 'Non-vegetarian'"></span>
                      <h4>{{ item.name }}</h4>
                    </div>
                    <span v-if="item.special" class="dish-special">✦ Carnival Special</span>
                    <div class="dish-price">
                      <span v-for="variant in item.variants || []" :key="variant.label" class="price-pill">
                        <small>{{ variant.label }}</small> ₹{{ variant.price }}
                      </span>
                      <span v-if="!item.variants" class="price-pill single-price">
                        {{ item.priceNote || ('₹' + item.price) }}
                      </span>
                    </div>
                  </article>
                </div>
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-inner page-width">
        <div class="footer-brand">
          <div class="footer-logo" aria-hidden="true">C</div>
          <p class="eyebrow">Gather around something delicious</p>
          <h2>{{ restaurant.name || 'The Carnival Restaurant' }}</h2>
          <p class="footer-tagline">{{ restaurant.cuisines.join(' | ') }}</p>
        </div>
        <div class="footer-contact">
          <a :href="phoneLink">{{ restaurant.phone }}</a>
          <span>{{ restaurant.address }}</span>
          <a :href="'https://instagram.com/' + restaurant.instagram" target="_blank" rel="noopener noreferrer">
            Instagram · @{{ restaurant.instagram }}
          </a>
          <a class="button button-orange review-button" href="https://g.page/r/REPLACE_WITH_GOOGLE_REVIEW_LINK/review" target="_blank" rel="noopener noreferrer">
            Review us on Google <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p class="restaurant-note">{{ restaurant.note }}</p>
        <div class="snack-banner">
          <span aria-hidden="true">✦</span>
          <p><strong>Snack Lounge</strong><small>Coming Soon</small></p>
          <span aria-hidden="true">✦</span>
        </div>
      </div>
      <p class="footer-bottom">Made with care at The Carnival Restaurant</p>
    </footer>

    <button v-if="showBackToTop" class="back-to-top" type="button" aria-label="Back to top" @click="backToTop">↑</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      menu: null,
      loading: true,
      loadError: '',
      searchTerm: '',
      selectedFilter: 'all',
      activeCategory: '',
      currentHero: 0,
      heroOffset: 0,
      showBackToTop: false,
      scrollFrame: null,
      heroTimer: null,
      revealObserver: null,
      filters: [
        { label: 'All', value: 'all' },
        { label: 'Veg', value: 'veg' },
        { label: 'Non-Veg', value: 'nonveg' },
      ],
    };
  },
  computed: {
    restaurant() {
      return this.menu ? this.menu.restaurant : { name: '', cuisines: [], phone: '', address: '', instagram: '', note: '', heroImages: [] };
    },
    heroImages() {
      return this.restaurant.heroImages || [];
    },
    categories() {
      return this.menu ? this.menu.categories : [];
    },
    phoneLink() {
      return `tel:${this.restaurant.phone.replace(/\s/g, '')}`;
    },
    specialItems() {
      return this.categories.reduce((specials, category) => {
        category.sections.forEach((section) => {
          section.items.filter((item) => item.special).forEach((item) => {
            specials.push({ item, category: category.name, image: category.image || section.image });
          });
        });
        return specials;
      }, []);
    },
    visibleCategories() {
      const query = this.searchTerm.toLowerCase();

      return this.categories
        .map((category) => {
          const categoryMatches = category.name.toLowerCase().includes(query);
          const sections = category.sections
            .map((section) => {
              const items = section.items.filter((item) => {
                const matchesDiet = this.selectedFilter === 'all'
                  || (this.selectedFilter === 'veg' && item.veg)
                  || (this.selectedFilter === 'nonveg' && !item.veg);
                const matchesSearch = !query || categoryMatches || item.name.toLowerCase().includes(query);
                return matchesDiet && matchesSearch;
              });
              return { ...section, items };
            })
            .filter((section) => section.items.length);

          return { ...category, sections };
        })
        .filter((category) => category.sections.length);
    },
  },
  watch: {
    searchTerm() {
      this.refreshActiveCategory();
    },
    selectedFilter(value) {
      try {
        localStorage.setItem('carnival-menu-filter', value);
      } catch (error) {
        // The menu still works when browser storage is unavailable.
      }
      this.refreshActiveCategory();
    },
  },
  async created() {
    document.title = 'The Carnival Restaurant | Menu';

    try {
      const response = await fetch('/menu.json');
      if (!response.ok) throw new Error(`Menu request returned ${response.status}`);
      this.menu = await response.json();
      this.startHeroSlideshow();
      this.$nextTick(() => {
        this.updateActiveCategory();
        this.observeNewContent();
      });
    } catch (error) {
      this.loadError = 'The menu could not be loaded. Please refresh the page or try again shortly.';
      console.error('Menu loading failed:', error);
    } finally {
      this.loading = false;
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    try {
      const savedFilter = localStorage.getItem('carnival-menu-filter');
      if (['all', 'veg', 'nonveg'].includes(savedFilter)) this.selectedFilter = savedFilter;
    } catch (error) {
      // Saving the filter is optional.
    }
    this.setupRevealObserver();
  },
  updated() {
    this.$nextTick(this.observeNewContent);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.clearInterval(this.heroTimer);
    if (this.scrollFrame) window.cancelAnimationFrame(this.scrollFrame);
    if (this.revealObserver) this.revealObserver.disconnect();
  },
  methods: {
    categoryId(name) {
      return `category-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    },
    itemCount(category) {
      return category.sections.reduce((total, section) => total + section.items.length, 0);
    },
    priceText(item) {
      if (item.variants) return item.variants.map((variant) => `${variant.label} ₹${variant.price}`).join(' · ');
      if (item.priceNote) return item.priceNote;
      return `₹${item.price}`;
    },
    startHeroSlideshow() {
      if (this.heroImages.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.heroTimer = window.setInterval(() => {
        this.currentHero = (this.currentHero + 1) % this.heroImages.length;
      }, 6500);
    },
    scrollToMenu() {
      document.getElementById('menu').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    scrollToCategory(name) {
      const id = this.categoryId(name);
      let target = document.getElementById(id);

      if (!target) {
        this.searchTerm = '';
        this.selectedFilter = 'all';
        this.$nextTick(() => {
          target = document.getElementById(id);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        return;
      }

      this.activeCategory = id;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    scrollSpecials(direction) {
      if (this.$refs.specialTrack) {
        this.$refs.specialTrack.scrollBy({ left: direction * 340, behavior: 'smooth' });
      }
    },
    handleScroll() {
      if (!this.scrollFrame) {
        this.scrollFrame = window.requestAnimationFrame(() => {
          this.heroOffset = Math.min(window.scrollY * 0.12, 76);
          this.showBackToTop = window.scrollY > 650;
          this.updateActiveCategory();
          this.scrollFrame = null;
        });
      }
    },
    refreshActiveCategory() {
      this.$nextTick(() => {
        if (!document.querySelector('.menu-category')) {
          this.activeCategory = '';
          return;
        }
        this.updateActiveCategory();
      });
    },
    updateActiveCategory() {
      const sections = Array.from(document.querySelectorAll('.menu-category'));
      if (!sections.length) return;

      let current = sections[0].id;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 210) current = section.id;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1].id;
      }
      this.activeCategory = current;
    },
    setupRevealObserver() {
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
        return;
      }

      this.revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
      this.observeNewContent();
    },
    observeNewContent() {
      if (!this.revealObserver) {
        if (!('IntersectionObserver' in window)) {
          document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
        }
        return;
      }
      document.querySelectorAll('.reveal:not([data-reveal-observed])').forEach((element) => {
        element.dataset.revealObserved = 'true';
        this.revealObserver.observe(element);
      });
    },
    backToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  },
};
</script>

<style>
:root {
  color-scheme: dark;
  --bg: #10100f;
  --surface: #191918;
  --surface-2: #22211f;
  --orange: #f26122;
  --text: #f8f5f0;
  --muted: #aaa39c;
  --green: #67c66e;
  --red: #f05a52;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 5.5rem; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}
button, input { font: inherit; }
button { color: inherit; }
a { color: inherit; }
.app-shell { min-height: 100vh; overflow: clip; }
.page-width { width: min(100% - 2rem, 74rem); margin-inline: auto; }
.eyebrow {
  margin: 0 0 0.55rem;
  color: var(--orange);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.19em;
  text-transform: uppercase;
}
.brush-title {
  margin: 0;
  color: var(--orange);
  font-family: "Brush Script MT", "Segoe Script", "URW Chancery L", cursive;
  font-size: clamp(2.3rem, 7vw, 3.5rem);
  font-weight: 500;
  line-height: 1.1;
}

/* Full-height food slideshow with a dark layer behind readable text. */
.hero {
  position: relative;
  display: grid;
  min-height: 100svh;
  overflow: hidden;
  place-items: center;
  isolation: isolate;
  background: #17110d;
}
.hero-backdrop, .hero-shade { position: absolute; inset: 0; z-index: -2; overflow: hidden; }
.hero-image {
  position: absolute;
  inset: -5%;
  width: 110%;
  height: 110%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1.8s ease;
  will-change: transform, opacity;
}
.hero-image.visible { opacity: 1; }
.hero-shade {
  z-index: -1;
  background: linear-gradient(90deg, rgba(10, 9, 8, 0.88) 0%, rgba(10, 9, 8, 0.6) 49%, rgba(10, 9, 8, 0.27) 100%), linear-gradient(0deg, rgba(9, 8, 7, 0.8), transparent 45%);
}
.hero-content {
  width: min(100% - 2rem, 74rem);
  margin: 0 auto;
  padding: 7rem 0 6.5rem;
  animation: hero-rise 800ms ease both;
}
.hero-brand { margin-bottom: 1.2rem; }
.logo-mark, .footer-logo {
  display: grid;
  width: 3.2rem;
  height: 3.2rem;
  margin-bottom: 1.25rem;
  place-items: center;
  border: 1px solid rgba(242, 97, 34, 0.8);
  border-radius: 50%;
  background: rgba(242, 97, 34, 0.15);
  color: #ff8a55;
  font-family: Georgia, serif;
  font-size: 1.85rem;
  font-style: italic;
}
.hero h1 {
  max-width: 11ch;
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(3.1rem, 9vw, 6.8rem);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 0.98;
  text-shadow: 0 5px 30px rgba(0, 0, 0, 0.35);
}
.hero-tagline {
  margin: 1.3rem 0 0;
  color: #f3eae2;
  font-size: clamp(0.82rem, 2vw, 1.05rem);
  font-weight: 650;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.hero-copy { margin: 0.65rem 0 0; color: #e0d5cc; font-family: Georgia, serif; font-size: 1.05rem; font-style: italic; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 2rem; }
.button {
  display: inline-flex;
  min-height: 3.15rem;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.8rem 1.25rem;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 750;
  text-decoration: none;
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
}
.button:hover { transform: translateY(-2px); }
.button-orange { background: var(--orange); color: #1b100b; box-shadow: 0 8px 28px rgba(242, 97, 34, 0.22); }
.button-orange:hover { background: #ff7c43; }
.button-glass { border-color: rgba(255, 255, 255, 0.4); background: rgba(255, 255, 255, 0.09); color: white; backdrop-filter: blur(12px); }
.button-glass:hover { border-color: white; background: rgba(255, 255, 255, 0.17); }
.hero-pager { display: flex; gap: 0.45rem; margin-top: 3rem; }
.hero-pager button { width: 1.9rem; height: 0.25rem; padding: 0; border: 0; border-radius: 9px; background: rgba(255, 255, 255, 0.4); cursor: pointer; transition: width 180ms ease, background 180ms ease; }
.hero-pager button.selected { width: 3rem; background: var(--orange); }
.hero-scroll-hint { position: absolute; right: max(1rem, calc((100vw - 74rem) / 2)); bottom: 2rem; color: rgba(255, 255, 255, 0.7); font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; }
.hero-scroll-hint span { margin-left: 0.5rem; color: var(--orange); }

/* Special dishes carousel. */
.specials-section { padding-top: 5rem; padding-bottom: 4.2rem; }
.section-topline { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
.carousel-controls { display: flex; gap: 0.45rem; }
.carousel-controls button {
  width: 2.65rem;
  height: 2.65rem;
  border: 1px solid rgba(255, 255, 255, 0.17);
  border-radius: 50%;
  background: var(--surface);
  cursor: pointer;
  font-size: 1.2rem;
  transition: border-color 160ms ease, background 160ms ease;
}
.carousel-controls button:hover { border-color: var(--orange); background: rgba(242, 97, 34, 0.13); }
.specials-track { display: flex; gap: 1rem; overflow-x: auto; padding: 0.1rem 0 1rem; scroll-snap-type: x mandatory; scrollbar-width: thin; scrollbar-color: #554034 transparent; }
.special-card { position: relative; display: flex; flex: 0 0 min(84vw, 25rem); min-height: 18rem; overflow: hidden; align-items: end; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.2rem; background: var(--surface-2); isolation: isolate; scroll-snap-align: start; }
.special-card > img, .special-card > .photo-placeholder { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; transition: transform 450ms ease; }
.special-card:hover > img { transform: scale(1.06); }
.special-card-shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(0deg, rgba(9, 8, 8, 0.94), rgba(9, 8, 8, 0.02) 92%); }
.special-card-copy { padding: 1.25rem; }
.special-kicker { display: inline-block; margin-bottom: 0.45rem; color: #ff986d; font-size: 0.67rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
.special-card h3 { margin: 0; font-family: Georgia, serif; font-size: 1.55rem; font-weight: 500; }
.special-card-copy > p { margin: 0.55rem 0 0.85rem; color: #ffb18f; font-weight: 750; }
.text-link { padding: 0; border: 0; background: transparent; color: #eee8e2; cursor: pointer; font-size: 0.76rem; font-weight: 700; }
.text-link:hover { color: #ff986d; }
.empty-specials { padding: 1.5rem; color: var(--muted); }

/* Visual category chooser. */
.showcase-section { padding-top: 0.5rem; padding-bottom: 4.8rem; }
.showcase-heading { margin-bottom: 1.4rem; }
.section-aside { margin: 0 0 0.4rem; color: var(--muted); font-size: 0.83rem; }
.category-showcase { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; }
.showcase-card { position: relative; display: block; min-width: 0; aspect-ratio: 0.9; overflow: hidden; padding: 0; border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 1rem; background: var(--surface-2); cursor: pointer; isolation: isolate; text-align: left; transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease; }
.showcase-card:hover, .showcase-card:focus-visible { transform: translateY(-5px); border-color: rgba(242, 97, 34, 0.65); box-shadow: 0 14px 35px rgba(0, 0, 0, 0.28); }
.showcase-card > img, .showcase-card > .photo-placeholder { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; transition: transform 500ms ease; }
.showcase-card:hover > img { transform: scale(1.07); }
.showcase-overlay { position: absolute; inset: 0; z-index: -1; background: linear-gradient(0deg, rgba(8, 8, 8, 0.9), rgba(8, 8, 8, 0.02) 80%); }
.showcase-content { position: absolute; right: 0.85rem; bottom: 0.9rem; left: 0.85rem; display: grid; gap: 0.27rem; }
.showcase-count { color: #e3d9d0; font-size: 0.64rem; font-weight: 650; letter-spacing: 0.08em; text-transform: uppercase; }
.showcase-content strong { max-width: calc(100% - 1.8rem); font-family: Georgia, serif; font-size: clamp(0.92rem, 3vw, 1.18rem); font-weight: 500; line-height: 1.2; }
.showcase-arrow { position: absolute; right: 0; bottom: 0; color: #ff986d; font-size: 1.15rem; }
.photo-placeholder { background: radial-gradient(circle at 78% 10%, rgba(255, 151, 94, 0.45), transparent 35%), linear-gradient(135deg, #9c3f1a, #301c13 62%, #171514); }
.skeleton-grid { pointer-events: none; }
.skeleton { background: linear-gradient(100deg, #211e1b 20%, #2b2622 38%, #211e1b 56%); background-size: 220% 100%; animation: skeleton-shimmer 1.4s ease infinite; }
.category-skeleton { aspect-ratio: 0.9; border-radius: 1rem; }

/* Sticky category thumbnails and menu search/filter. */
.category-nav { position: sticky; z-index: 20; top: 0; border-block: 1px solid rgba(255, 255, 255, 0.08); background: rgba(16, 16, 15, 0.91); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.category-nav-inner { display: flex; width: min(100%, 78rem); gap: 0.35rem; margin: 0 auto; overflow-x: auto; padding: 0.55rem 0.75rem; scrollbar-width: none; }
.category-nav-inner::-webkit-scrollbar { display: none; }
.category-chip { display: flex; flex: 0 0 auto; min-height: 2.9rem; align-items: center; gap: 0.48rem; padding: 0.32rem 0.75rem 0.32rem 0.35rem; border: 1px solid transparent; border-radius: 999px; background: transparent; color: #c1bab4; cursor: pointer; font-size: 0.74rem; font-weight: 680; transition: color 160ms ease, background 160ms ease, border-color 160ms ease; }
.category-chip:hover { color: white; }
.category-chip.active { border-color: rgba(242, 97, 34, 0.55); background: rgba(242, 97, 34, 0.16); color: #ff9a70; }
.chip-image { display: grid; width: 2.1rem; height: 2.1rem; flex: 0 0 2.1rem; overflow: hidden; place-items: center; border-radius: 50%; background: linear-gradient(135deg, #b9471a, #492719); color: #ffd3bc; font-family: Georgia, serif; font-size: 1rem; }
.chip-image img { width: 100%; height: 100%; object-fit: cover; }
.menu-section { padding-top: 3.2rem; padding-bottom: 5.5rem; scroll-margin-top: 4.8rem; }
.menu-intro { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1.4rem; }
.menu-intro-note { margin: 0 0 0.5rem; color: var(--muted); font-family: Georgia, serif; font-size: 0.95rem; font-style: italic; }
.search-panel { position: sticky; z-index: 15; top: 4.2rem; display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 2rem; padding: 0.65rem; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1rem; background: rgba(25, 25, 24, 0.94); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.23); backdrop-filter: blur(16px); }
.search-box { display: flex; min-height: 2.9rem; align-items: center; gap: 0.6rem; padding: 0 0.85rem; border: 1px solid #34302d; border-radius: 0.7rem; background: #121211; }
.search-box:focus-within { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(242, 97, 34, 0.12); }
.search-icon { color: var(--orange); font-size: 1.6rem; line-height: 1; transform: rotate(-20deg); }
.search-box input { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--text); font-size: 0.88rem; }
.search-box input::placeholder { color: #87817b; }
.clear-search { display: grid; width: 2rem; height: 2rem; flex: 0 0 2rem; place-items: center; border: 0; border-radius: 50%; background: #34302d; cursor: pointer; font-size: 1.3rem; }
.filter-group { display: flex; gap: 0.4rem; }
.filter-pill { display: inline-flex; min-height: 2.35rem; align-items: center; gap: 0.4rem; padding: 0.55rem 0.85rem; border: 1px solid #393532; border-radius: 999px; background: #201e1c; color: #c8c0b9; cursor: pointer; font-size: 0.74rem; font-weight: 720; transition: border-color 160ms ease, color 160ms ease, background 160ms ease; }
.filter-pill:hover { border-color: var(--orange); color: white; }
.filter-pill.selected { border-color: var(--orange); background: rgba(242, 97, 34, 0.18); color: #ff9b70; }
.diet-dot { display: inline-block; width: 0.5rem; height: 0.5rem; flex: 0 0 0.5rem; border-radius: 50%; }
.veg-dot { background: var(--green); box-shadow: 0 0 10px rgba(103, 198, 110, 0.3); }
.nonveg-dot { background: var(--red); box-shadow: 0 0 10px rgba(240, 90, 82, 0.3); }

/* Category photo banners and tappable dish cards. */
.menu-list { display: grid; gap: 3.3rem; }
.menu-category { scroll-margin-top: 5rem; }
.category-banner { position: relative; display: flex; min-height: 12rem; overflow: hidden; align-items: end; margin-bottom: 1.15rem; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 1.15rem; background: var(--surface-2); isolation: isolate; }
.category-banner > img, .category-banner > .photo-placeholder { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; }
.category-banner-shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(90deg, rgba(8, 8, 8, 0.86), rgba(8, 8, 8, 0.25)), linear-gradient(0deg, rgba(8, 8, 8, 0.55), transparent); }
.category-banner-copy { padding: 1.3rem 1.2rem; }
.category-banner-copy .eyebrow { color: #ffab86; }
.category-banner-copy .brush-title { color: white; font-size: clamp(2.5rem, 8vw, 3.8rem); text-shadow: 0 3px 16px rgba(0, 0, 0, 0.5); }
.sections-grid { display: grid; gap: 1.2rem; }
.menu-subsection { min-width: 0; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.075); border-radius: 1.1rem; background: linear-gradient(145deg, #1c1b19, #171716); box-shadow: 0 9px 28px rgba(0, 0, 0, 0.15); }
.subsection-visual { position: relative; display: flex; min-height: 8rem; overflow: hidden; align-items: end; background: var(--surface-2); isolation: isolate; }
.subsection-visual > img, .subsection-visual > .photo-placeholder { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; }
.subsection-shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(0deg, rgba(9, 9, 8, 0.78), rgba(9, 9, 8, 0.02)); }
.subsection-visual h3 { margin: 0; padding: 0.9rem 1rem; color: white; font-size: 0.77rem; font-weight: 800; letter-spacing: 0.17em; text-transform: uppercase; }
.dish-grid { display: grid; grid-template-columns: 1fr; gap: 0.55rem; padding: 0.8rem; }
.dish-card { display: grid; min-height: 5.15rem; grid-template-columns: minmax(0, 1fr) auto; align-content: center; align-items: center; gap: 0.55rem 0.65rem; padding: 0.8rem; border: 1px solid rgba(255, 255, 255, 0.065); border-radius: 0.8rem; background: rgba(255, 255, 255, 0.035); animation: dish-in 360ms ease both; transition: transform 160ms ease, border-color 160ms ease, background 160ms ease; }
.dish-card:hover { transform: translateY(-2px); border-color: rgba(242, 97, 34, 0.38); background: rgba(242, 97, 34, 0.07); }
.dish-title-row { display: flex; min-width: 0; align-items: flex-start; gap: 0.55rem; }
.dish-title-row .diet-dot { margin-top: 0.38rem; }
.dish-title-row h4 { margin: 0; font-size: 0.86rem; font-weight: 620; line-height: 1.38; }
.dish-special { grid-column: 1; width: fit-content; padding: 0.22rem 0.48rem; border-radius: 999px; background: rgba(242, 97, 34, 0.16); color: #ff9b70; font-size: 0.62rem; font-weight: 800; }
.dish-price { display: flex; grid-column: 2; grid-row: 1 / span 2; align-items: center; justify-content: end; gap: 0.35rem; }
.price-pill { display: inline-flex; min-height: 2rem; flex-direction: column; align-items: center; justify-content: center; padding: 0.27rem 0.55rem; border: 1px solid rgba(242, 97, 34, 0.29); border-radius: 0.55rem; background: rgba(242, 97, 34, 0.09); color: #ffad88; font-size: 0.76rem; font-variant-numeric: tabular-nums; font-weight: 780; white-space: nowrap; }
.price-pill small { margin-bottom: 0.08rem; color: #c7a18e; font-size: 0.52rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.single-price { min-width: 3.35rem; }
.loading-message, .message-card { margin: 1.5rem 0; padding: 1.2rem; border: 1px solid rgba(242, 97, 34, 0.27); border-radius: 1rem; background: var(--surface); color: #e1d8d0; text-align: center; }
.error-message { border-color: rgba(240, 90, 82, 0.4); }

/* Contact footer and return-to-top control. */
.site-footer { padding: 3.2rem 0 1.2rem; border-top: 1px solid rgba(255, 255, 255, 0.08); background: #0a0a09; }
.footer-inner { display: grid; gap: 2rem; }
.footer-logo { margin: 0 0 1rem; }
.footer-brand h2 { margin: 0 0 0.5rem; font-family: Georgia, serif; font-size: 1.6rem; font-weight: 500; }
.footer-tagline { margin: 0; color: var(--muted); font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase; }
.footer-contact { display: grid; justify-items: start; gap: 0.7rem; color: #d6cec7; font-size: 0.85rem; }
.footer-contact > a:not(.button) { text-decoration-color: rgba(242, 97, 34, 0.5); text-underline-offset: 0.2rem; }
.review-button { margin-top: 0.3rem; }
.restaurant-note { max-width: 35rem; margin: 0; color: #c8bdb3; font-family: Georgia, serif; font-size: 1rem; font-style: italic; line-height: 1.55; }
.snack-banner { display: flex; width: fit-content; min-width: min(100%, 16rem); align-items: center; justify-content: center; gap: 1rem; padding: 0.9rem 1.2rem; border: 1px solid rgba(242, 97, 34, 0.35); border-radius: 0.95rem; background: linear-gradient(110deg, rgba(242, 97, 34, 0.15), rgba(242, 97, 34, 0.035)); color: var(--orange); }
.snack-banner p { display: grid; gap: 0.15rem; margin: 0; text-align: center; }
.snack-banner strong { color: #ff956a; font-family: Georgia, serif; font-size: 1rem; font-weight: 500; }
.snack-banner small { color: var(--muted); font-size: 0.63rem; letter-spacing: 0.16em; text-transform: uppercase; }
.footer-bottom { margin: 2.3rem 1rem 0; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.07); color: #77716c; font-size: 0.68rem; text-align: center; }
.back-to-top { position: fixed; z-index: 30; right: 1rem; bottom: 1rem; display: grid; width: 3rem; height: 3rem; place-items: center; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 50%; background: rgba(242, 97, 34, 0.94); color: #1b100b; cursor: pointer; font-size: 1.35rem; font-weight: 800; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); animation: dish-in 180ms ease both; }

/* Subtle entrance motion; content stays visible if motion is unsupported. */
.reveal { opacity: 0; transform: translateY(18px); transition: opacity 550ms ease, transform 550ms ease; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
.showcase-card.reveal { transition-delay: 40ms; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; clip-path: inset(50%); }
@keyframes hero-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes dish-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
@keyframes skeleton-shimmer { to { background-position-x: -220%; } }

@media (min-width: 600px) {
  .page-width { width: min(100% - 3rem, 74rem); }
  .hero-content { width: min(100% - 3rem, 74rem); }
  .category-showcase { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
  .showcase-card { aspect-ratio: 1.08; border-radius: 1.1rem; }
  .search-panel { flex-direction: row; align-items: center; justify-content: space-between; padding: 0.65rem; }
  .search-box { flex: 1; }
  .dish-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .special-card { flex-basis: 23rem; min-height: 20rem; }
  .footer-inner { grid-template-columns: 1.2fr 1fr; align-items: start; }
  .restaurant-note, .snack-banner { grid-column: 1 / -1; }
}
@media (min-width: 900px) {
  .hero-content { padding-block: 8rem; }
  .hero h1 { font-size: clamp(5rem, 8vw, 7.4rem); }
  .specials-section { padding-top: 6rem; }
  .category-showcase { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.1rem; }
  .showcase-card { aspect-ratio: 1.12; }
  .sections-grid { grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); }
  .menu-subsection:only-child { grid-column: 1 / -1; }
  .dish-grid { grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
  .footer-inner { grid-template-columns: 1.1fr 1fr 1fr; align-items: center; }
  .restaurant-note { grid-column: 1 / 3; }
  .snack-banner { grid-column: 3; justify-self: end; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  .hero-image { transform: none !important; }
}
</style>
