import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const WHATSAPP_URL = 'https://wa.me/5512988859898'
const INSTAGRAM_URL = 'https://www.instagram.com/smoked_defumados?psln=MWVhMjRiN2ZrZDZiNQ=='
const ADDRESS = 'Av. Vinte e Três de Dezembro, 279 - Jardim das Cerejeiras, São José dos Campos - SP, 12225-480'
const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`
const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`

const catalogProducts = [
  { id: 'farofa-completa', name: 'Farofa completa pequena', detail: 'Porção de 250 g', orderUnit: 'porção de 250 g', price: 700, category: 'acompanhamentos', image: '/images/catalog/farofa-completa.jpg', alt: 'Farofa completa com ingredientes variados' },
  { id: 'farofa-grande', name: 'Farofa grande', detail: 'Porção grande', orderUnit: 'porção grande', price: 1400, category: 'acompanhamentos', image: '/images/catalog/farofa-grande.jpg', alt: 'Porção grande de farofa completa' },
  { id: 'salpicao-pequeno', name: 'Salpicão pequeno', detail: 'Porção pequena', orderUnit: 'porção pequena', price: 1250, category: 'acompanhamentos', image: '/images/catalog/salpicao-pequeno.jpg', alt: 'Porção pequena de salpicão' },
  { id: 'salpicao-grande', name: 'Salpicão grande', detail: 'Porção grande', orderUnit: 'porção grande', price: 2500, category: 'acompanhamentos', image: '/images/catalog/salpicao-grande.jpg', alt: 'Porção grande de salpicão' },
  { id: 'maionese-pequena', name: 'Maionese pequena', detail: 'Porção pequena', orderUnit: 'porção pequena', price: 1250, category: 'acompanhamentos', image: '/images/catalog/maionese-pequena.jpg', alt: 'Porção pequena de maionese de legumes' },
  { id: 'maionese-grande', name: 'Maionese grande', detail: 'Porção grande', orderUnit: 'porção grande', price: 2500, category: 'acompanhamentos', image: '/images/catalog/maionese-grande.jpg', alt: 'Porção grande de maionese de legumes' },
  { id: 'frango-inteiro', name: 'Frango inteiro defumado e assado', detail: 'Aproximadamente 2 kg por unidade', orderUnit: 'unidade (aprox. 2 kg)', price: 5000, category: 'defumados', image: '/images/catalog/frango-inteiro.jpg', alt: 'Frango inteiro assado e defumado' },
  { id: 'costela-suina', name: 'Costela suína defumada e assada', detail: 'Preço por 100 g', orderUnit: 'porção de 100 g', price: 900, category: 'defumados', image: '/images/catalog/costela-suina.jpg', alt: 'Costela suína defumada e assada' },
  { id: 'costela-cordeiro', name: 'Costela de cordeiro defumada e assada', detail: 'Por 100 g · Sob encomenda', orderUnit: 'porção de 100 g, sob encomenda', price: 1200, category: 'defumados', image: '/images/catalog/costela-cordeiro.jpg', alt: 'Costela de cordeiro assada' },
  { id: 'panceta', name: 'Panceta defumada e assada', detail: 'Preço por 100 g', orderUnit: 'porção de 100 g', price: 900, category: 'defumados', image: '/images/catalog/panceta.jpg', alt: 'Panceta defumada e assada' },
  { id: 'costela-bovina', name: 'Costela bovina defumada e assada', detail: 'Desossada · Preço por 100 g', orderUnit: 'porção de 100 g', price: 1200, category: 'defumados', image: '/images/catalog/costela-bovina.jpg', alt: 'Costela bovina desossada, defumada e assada' },
]

const formatPrice = (cents) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)

const features = [
  { icon: 'flame', title: 'Defumação Artesanal', text: 'Sabor único e inconfundível.' },
  { icon: 'medal', title: 'Carnes Nobres', text: 'Qualidade em cada corte.' },
  { icon: 'check', title: 'Atendimento Especializado', text: 'Sua satisfação em primeiro lugar.' },
  { icon: 'truck', title: 'Entrega Rápida', text: 'Com todo o cuidado.' },
]

function Icon({ name, size = 22, className = '' }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, className }
  const paths = {
    flame: <><path d="M12.2 22c4.1 0 7-2.7 7-6.7 0-3.4-2.2-5.7-4.6-8.7-.4 2.6-1.7 3.6-2.8 4.4C11.8 7.5 9.6 4.4 7.2 2 7.3 7 4 9.7 4 15.2 4 19.2 7.1 22 12.2 22Z" fill="currentColor" stroke="none"/><path d="M12 21.5c2.1 0 3.5-1.4 3.5-3.2 0-1.2-.7-2.1-1.8-3.3-.2 1.2-.9 1.7-1.8 2.2-.3-1.4-1-2.4-1.8-3.3-.1 2.1-1.6 3-1.6 4.6 0 1.8 1.4 3 3.5 3Z" fill="#16100b" stroke="none"/></>,
    medal: <><path d="m8 3 4 5 4-5 4 2-2 6 2 3-1.7 6H5.7L4 14l2-3-2-6 4-2Z" fill="currentColor" stroke="none"/><path d="m9.5 12 1.6 1.6 3.5-3.5" stroke="#16100b" strokeWidth="1.7"/></>,
    check: <><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"/><path d="m7.5 12.1 3 3 6-6" stroke="#16100b" strokeWidth="2.5"/></>,
    truck: <><path d="M2 6h12v11H2z" fill="currentColor" stroke="none"/><path d="M14 10h4l4 4v3h-8z" fill="currentColor" stroke="none"/><path d="M2 9h12M5 4v5m6-5v5" stroke="#16100b" strokeWidth="1.2"/><circle cx="6" cy="18" r="2" fill="#f4770b" stroke="#080706" strokeWidth="1.7"/><circle cx="18" cy="18" r="2" fill="#f4770b" stroke="#080706" strokeWidth="1.7"/></>,
    arrow: <><path d="M4 12h15M13 5l7 7-7 7"/></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
    whatsapp: <><path d="M20.4 11.8a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.3-4.8a8.4 8.4 0 1 1 16.1-3.9Z"/><path d="M8.6 8.3c.2-.5.5-.6.8-.6h.5c.2 0 .4 0 .5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.3.4-.1.7.3.6 1 1.6 2.1 2.2.9.5 1.2.5 1.5.2l.8-.9c.2-.2.4-.2.7-.1l1.7.8c.3.1.4.3.4.5 0 .3-.2 1.1-.8 1.5-.5.4-1.2.7-2.1.5-1-.2-2.4-.7-4.1-2.2-1.4-1.3-2.3-2.8-2.6-3.8-.3-1 0-1.9.4-2.4Z" fill="currentColor" stroke="none"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.6 6.5h.01" strokeWidth="2.5"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    minus: <><path d="M5 12h14"/></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function WhatsAppLink({ children, className = '', label, href = WHATSAPP_URL }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={label}>{children}</a>
}

function Brand({ footer = false }) {
  return <a className={`brand${footer ? ' brand--footer' : ''}`} href="#inicio" aria-label="Smoked Defumados — início"><img src="/images/smoked-logo.png?v=20261102" alt="Smoked Defumados" /></a>
}

function Header({ cartCount, onOpenCart }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const navLinks = [
    ['Início', '#inicio'], ['Cardápio', '#cardapio'], ['Sobre', '#sobre'], ['Contato', '#contato'],
  ]

  return <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
    <div className="header-inner">
      <Brand />
      <nav className={`primary-nav${menuOpen ? ' is-open' : ''}`} id="primary-navigation" aria-label="Navegação principal">
        {navLinks.map(([label, href], index) => <a key={href} href={href} className={index === 0 ? 'nav-link is-active' : 'nav-link'} onClick={closeMenu}>{label}</a>)}
      </nav>
      <button className="header-order" type="button" onClick={onOpenCart} aria-label={`Abrir carrinho, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}><Icon name="bag" size={21} /><span>Meu carrinho</span><span className="cart-count">{cartCount}</span></button>
      <button className={`menu-toggle${menuOpen ? ' is-open' : ''}`} type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-controls="primary-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
      </button>
    </div>
  </header>
}

function Hero() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    const content = contentRef.current
    if (!section || !video || !content) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0

    const updateFrame = () => {
      animationFrame = 0
      video.pause()

      if (reducedMotion.matches) {
        content.style.setProperty('--hero-copy-opacity', '1')
        content.style.setProperty('--hero-copy-shift', '0px')
        return
      }

      const scrollRange = Math.max(1, section.offsetHeight - video.parentElement.offsetHeight)
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / scrollRange))
      content.style.setProperty('--hero-copy-opacity', String(Math.max(0, 1 - progress * 1.8)))
      content.style.setProperty('--hero-copy-shift', `${-18 * progress}px`)

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA && Number.isFinite(video.duration) && !video.seeking) {
        const targetTime = video.duration * progress
        if (Math.abs(video.currentTime - targetTime) > 0.025) video.currentTime = targetTime
      }
    }

    const scheduleUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateFrame)
    }

    const onMotionPreferenceChange = () => scheduleUpdate()
    video.addEventListener('loadedmetadata', scheduleUpdate)
    video.addEventListener('seeked', scheduleUpdate)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionPreferenceChange)
    else reducedMotion.addListener(onMotionPreferenceChange)
    scheduleUpdate()

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      video.removeEventListener('loadedmetadata', scheduleUpdate)
      video.removeEventListener('seeked', scheduleUpdate)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (reducedMotion.removeEventListener) reducedMotion.removeEventListener('change', onMotionPreferenceChange)
      else reducedMotion.removeListener(onMotionPreferenceChange)
    }
  }, [])

  return <>
    <section ref={sectionRef} className="hero-scroll-section" id="inicio" aria-labelledby="hero-title">
      <div className="hero">
        <video ref={videoRef} className="hero-video" src="/videos/smoked-hero-original.mp4" muted playsInline preload="auto" aria-hidden="true" tabIndex={-1} />
        <div className="hero-shade" aria-hidden="true" />
        <div className="smoke smoke--one" aria-hidden="true" />
        <div className="smoke smoke--two" aria-hidden="true" />
        <div ref={contentRef} className="hero-content page-width">
          <p className="hero-eyebrow">Defumação artesanal · São José dos Campos</p>
          <h1 id="hero-title">Sabor defumado<br />em cada <span>detalhe</span></h1>
          <p className="hero-copy">Carnes nobres, defumação artesanal<br className="desktop-break" /> e um sabor incomparável.</p>
          <div className="hero-actions">
            <a className="button button--primary" href="#catalog-title"><Icon name="bag" size={22} />Monte seu pedido</a>
            <a className="button button--outline" href="#cardapio">Nosso Cardápio <span className="play-triangle" aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
    <div className="feature-strip page-width" aria-label="Diferenciais Smoked">
      {features.map((feature, index) => <article className="feature-item reveal" data-reveal data-delay={index * 90} key={feature.title}>
        <div className="feature-icon"><Icon name={feature.icon} size={25} /></div>
        <h2>{feature.title}</h2>
        <p>{feature.text}</p>
      </article>)}
    </div>
  </>
}

function SectionHeading({ eyebrow, children, className = '' }) {
  return <div className={`section-heading reveal ${className}`} data-reveal>
    <p className="section-eyebrow"><span />{eyebrow}<span /></p>
    <h2>{children}</h2>
  </div>
}

function QuantityControl({ quantity, onAdd, onRemove, label }) {
  if (!quantity) return <button type="button" className="add-button" onClick={onAdd}><Icon name="plus" size={17} />Adicionar</button>
  return <div className="quantity-control" aria-label={`Quantidade de ${label}`}>
    <button type="button" onClick={onRemove} aria-label={`Remover uma unidade de ${label}`}><Icon name="minus" size={16} /></button>
    <span aria-live="polite">{quantity}</span>
    <button type="button" onClick={onAdd} aria-label={`Adicionar uma unidade de ${label}`}><Icon name="plus" size={16} /></button>
  </div>
}

function CatalogCard({ product, quantity, onAdd, onRemove, index }) {
  return <article className="catalog-card reveal" data-reveal data-delay={(index % 4) * 90}>
    <div className="catalog-photo"><img src={product.image} alt={product.alt} loading="lazy" />{product.detail.includes('Sob encomenda') && <span className="made-to-order">Sob encomenda</span>}</div>
    <div className="catalog-info">
      <h3>{product.name}</h3>
      <p className="catalog-detail">{product.detail}</p>
      <div className="catalog-buy-row"><strong>{formatPrice(product.price)}{product.category === 'defumados' && product.id !== 'frango-inteiro' ? <small> / 100 g</small> : null}</strong><QuantityControl quantity={quantity} onAdd={onAdd} onRemove={onRemove} label={product.name} /></div>
    </div>
  </article>
}

function MenuSection({ cart, onAdd, onRemove }) {
  const [category, setCategory] = useState('todos')
  const visibleProducts = category === 'todos' ? catalogProducts : catalogProducts.filter((product) => product.category === category)
  const categories = [
    { id: 'todos', label: 'Todos', count: catalogProducts.length },
    { id: 'acompanhamentos', label: 'Acompanhamentos', count: 6 },
    { id: 'defumados', label: 'Defumados', count: 5 },
  ]

  return <section className="menu-section section-pad" id="cardapio" aria-labelledby="menu-title">
    <div className="page-width">
      <SectionHeading eyebrow="Nosso Cardápio"><span id="menu-title">Escolha o seu favorito</span></SectionHeading>
      <section className="catalog-section" aria-labelledby="catalog-title">
        <div className="catalog-heading reveal" data-reveal>
          <div><p className="catalog-eyebrow">Peça do seu jeito</p><h3 id="catalog-title">Cardápio completo</h3></div>
          <p>Escolha os itens e quantidades para montar seu pedido.</p>
        </div>
        <div className="category-tabs" role="group" aria-label="Filtrar cardápio por categoria">
          {categories.map((item) => <button key={item.id} className={`category-tab${category === item.id ? ' is-active' : ''}`} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}<span>{item.count}</span></button>)}
        </div>
        <div className="catalog-grid" aria-live="polite">
          {visibleProducts.map((product, index) => <CatalogCard key={product.id} product={product} quantity={cart[product.id] || 0} onAdd={() => onAdd(product.id)} onRemove={() => onRemove(product.id)} index={index} />)}
        </div>
      </section>
    </div>
  </section>
}

function CartDrawer({ cart, isOpen, onClose, onAdd, onRemove }) {
  const cartLines = catalogProducts.filter((product) => cart[product.id])
  const itemCount = cartLines.reduce((sum, item) => sum + cart[item.id], 0)
  const total = cartLines.reduce((sum, item) => sum + item.price * cart[item.id], 0)
  const messageLines = cartLines.map((item) => `• ${cart[item.id]} × ${item.name} (${item.orderUnit}) — ${formatPrice(item.price * cart[item.id])}`)
  const orderMessage = `Olá! Gostaria de fazer este pedido:\n\n${messageLines.join('\n')}\n\nTotal dos itens: ${formatPrice(total)}`
  const checkoutUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(orderMessage)}`

  useEffect(() => {
    if (!isOpen) return undefined
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', closeOnEscape) }
  }, [isOpen, onClose])

  if (!isOpen) return null
  return <div className="cart-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div className="cart-header"><div><p className="catalog-eyebrow">Smoked Defumados</p><h2 id="cart-title">Seu carrinho <span>{itemCount}</span></h2></div><button className="cart-close" type="button" onClick={onClose} aria-label="Fechar carrinho"><Icon name="close" size={22} /></button></div>
      {cartLines.length ? <>
        <div className="cart-lines">{cartLines.map((product) => <article className="cart-line" key={product.id}>
          <img src={product.image} alt="" />
          <div className="cart-line-info"><h3>{product.name}</h3><p>{formatPrice(product.price)} · {product.orderUnit}</p><div className="cart-line-controls"><button type="button" onClick={() => onRemove(product.id)} aria-label={`Diminuir ${product.name}`}><Icon name="minus" size={14} /></button><span>{cart[product.id]}</span><button type="button" onClick={() => onAdd(product.id)} aria-label={`Aumentar ${product.name}`}><Icon name="plus" size={14} /></button></div></div>
          <strong>{formatPrice(product.price * cart[product.id])}</strong>
        </article>)}</div>
        <div className="cart-summary"><div><span>Subtotal dos itens</span><strong>{formatPrice(total)}</strong></div><p>O pedido será enviado pelo WhatsApp para confirmação.</p><a className="button button--primary checkout-button" href={checkoutUrl} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={21} />Finalizar pelo WhatsApp <Icon name="arrow" size={18} /></a></div>
      </> : <div className="cart-empty"><span className="cart-empty-icon"><Icon name="bag" size={29} /></span><h3>Seu carrinho está vazio</h3><p>Escolha seus acompanhamentos e defumados para montar o pedido.</p><a className="button button--primary" href="#catalog-title" onClick={onClose}>Ver cardápio</a></div>}
    </aside>
  </div>
}

function AboutSection() {
  return <section className="about-section" id="sobre" aria-labelledby="about-title">
    <div className="about-photo reveal reveal--from-left" data-reveal>
      <img src="/images/smoked-team.jpg" alt="Três integrantes da equipe Smoked Defumados" loading="lazy" />
      <span className="about-photo-frame" aria-hidden="true" />
    </div>
    <div className="about-content reveal reveal--from-right" data-reveal>
      <p className="about-eyebrow">Sobre o Smoked <span /></p>
      <h2 id="about-title">Mais que churrasco,<br />uma <em>experiência.</em></h2>
      <p className="about-copy">No Smoked, unimos tradição, técnica e paixão pelo fogo para entregar carnes defumadas com um sabor inigualável. Cada detalhe é pensado para proporcionar uma experiência gastronômica única.</p>
      <a className="button button--outline button--about" href="#localizacao">Conheça mais <Icon name="arrow" size={19} /></a>
    </div>
  </section>
}

function LocationSection() {
  return <section className="location-section section-pad" id="localizacao" aria-labelledby="location-title">
    <div className="page-width location-layout">
      <div className="location-copy reveal reveal--from-left" data-reveal>
        <p className="section-eyebrow section-eyebrow--left"><span />Onde estamos</p>
        <h2 id="location-title">Encontre o <em>Smoked</em></h2>
        <p className="location-intro">Venha conhecer nosso espaço e experimentar o verdadeiro sabor da defumação artesanal.</p>
        <div className="address-card">
          <span className="address-icon"><Icon name="pin" size={23} /></span>
          <div><span className="address-label">Nosso endereço</span><address>{ADDRESS}</address></div>
        </div>
        <a className="button button--primary button--directions" href={MAPS_URL} target="_blank" rel="noreferrer">Como chegar <Icon name="arrow" size={19} /></a>
      </div>
      <div className="map-frame reveal reveal--zoom" data-reveal data-delay="150">
        <iframe title="Mapa para o Smoked Defumados em São José dos Campos" src={MAP_EMBED_URL} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        <span className="map-accent" aria-hidden="true" />
      </div>
    </div>
  </section>
}

function OrderBanner({ onOpenCart }) {
  return <section className="order-banner" id="contato" aria-labelledby="order-title">
    <img src="/images/smoked-meats.jpg" alt="" aria-hidden="true" loading="lazy" />
    <span className="order-banner-shade" aria-hidden="true" />
    <div className="page-width order-banner-inner">
      <div className="reveal reveal--from-left" data-reveal>
        <h2 id="order-title">Faça já seu pedido!</h2>
        <p>Garanta agora essa experiência de sabor.</p>
      </div>
      <button className="button button--primary button--banner reveal reveal--from-right" data-reveal data-delay="150" type="button" onClick={onOpenCart}><Icon name="bag" size={24} />Montar meu pedido <Icon name="arrow" size={19} /></button>
    </div>
  </section>
}

function HoursSection() {
  return <section className="hours-section section-pad" aria-labelledby="hours-title">
    <div className="hours-card page-width reveal reveal--zoom" data-reveal>
      <div className="hours-intro">
        <span className="hours-icon"><Icon name="clock" size={25} /></span>
        <div><p className="about-eyebrow">Planeje sua visita</p><h2 id="hours-title">Horário de funcionamento</h2></div>
      </div>
      <div className="hours-details">
        <div className="hours-open"><span className="day">Domingo</span><span className="hours-time">11:30 <i>às</i> 14:00</span><span className="open-pill"><span />Aberto</span></div>
        <div className="hours-closed"><span className="day">Segunda a sábado</span><span className="hours-time">Fechado</span></div>
        <p className="hours-note">Atendimento exclusivamente aos domingos.</p>
      </div>
    </div>
  </section>
}

function Footer() {
  const footerLinks = [['Início', '#inicio'], ['Cardápio', '#cardapio'], ['Sobre', '#sobre'], ['Contato', '#contato']]
  return <footer className="site-footer">
    <div className="page-width footer-main reveal" data-reveal>
      <Brand footer />
      <nav className="footer-nav" aria-label="Navegação do rodapé">{footerLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <div className="social-links">
        <a href={INSTAGRAM_URL} aria-label="Instagram Smoked Defumados" target="_blank" rel="noreferrer"><Icon name="instagram" size={25} /></a>
        <WhatsAppLink label="WhatsApp Smoked Defumados"><Icon name="whatsapp" size={25} /></WhatsAppLink>
      </div>
    </div>
    <div className="page-width footer-legal"><p>Smoked <span>•</span> Sabor defumado em cada detalhe <span>•</span> Todos os direitos reservados.</p></div>
  </footer>
}

function App() {
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const addItem = useCallback((id) => setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 })), [])
  const removeItem = useCallback((id) => setCart((current) => {
    const next = { ...current }
    if ((next[id] || 0) <= 1) delete next[id]
    else next[id] -= 1
    return next
  }), [])
  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  useEffect(() => {
    const root = document.documentElement
    const elements = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    root.classList.add('has-reveal')
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          activeObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' })

    const observeReveal = (element) => {
      if (!(element instanceof Element)) return
      if (element.matches('[data-reveal]')) observer.observe(element)
      element.querySelectorAll('[data-reveal]').forEach((nestedElement) => observer.observe(nestedElement))
    }
    elements.forEach((element) => observer.observe(element))
    const mutations = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach(observeReveal)))
    mutations.observe(document.getElementById('root'), { childList: true, subtree: true })
    const fallback = window.setTimeout(() => elements.forEach((element) => element.classList.add('is-visible')), 1800)
    return () => { observer.disconnect(); mutations.disconnect(); window.clearTimeout(fallback); root.classList.remove('has-reveal') }
  }, [])

  return <>
    <a className="skip-link" href="#principal">Pular para o conteúdo</a>
    <Header cartCount={cartCount} onOpenCart={openCart} />
    <main id="principal">
      <Hero />
      <MenuSection cart={cart} onAdd={addItem} onRemove={removeItem} />
      <AboutSection />
      <LocationSection />
      <OrderBanner onOpenCart={openCart} />
      <HoursSection />
    </main>
    <Footer />
    <button className="floating-order" type="button" onClick={openCart} aria-label={`Abrir carrinho com ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}><Icon name="bag" size={21} /><span>Carrinho</span><span className="cart-count">{cartCount}</span></button>
    <CartDrawer cart={cart} isOpen={cartOpen} onClose={closeCart} onAdd={addItem} onRemove={removeItem} />
  </>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
