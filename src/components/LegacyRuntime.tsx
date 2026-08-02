'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination, Parallax, Thumbs } from 'swiper/modules';

// The mirror never captured Swiper's own stylesheet: the SaaS bundle injected it
// from a CDN at runtime. Without it every slide stacks vertically.
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const SENT = 'Thank you — your message has been sent. We will reply shortly.';
const FAILED = 'Sorry, the message could not be sent. Please email admin@huazeno.com.';

export default function LegacyRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    cleanups.push(wireNavigation(), wireForms(), wireReveals());
    cleanups.push(...wireSwipers());
    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}

function wireNavigation() {
  const drawer = document.querySelector<HTMLElement>('.p_navContent');
  const openButton = document.querySelector<HTMLElement>('.p_navButton .p_openIcon');
  const closeButton = document.querySelector<HTMLElement>('.p_navContent .p_closeIcon');

  const open = () => drawer?.classList.add('is-open');
  const close = () => drawer?.classList.remove('is-open');

  openButton?.addEventListener('click', open);
  closeButton?.addEventListener('click', close);

  // On phones the arrow next to a top-level item opens its submenu instead of
  // navigating, exactly as the original bundle did.
  const arrows = Array.from(document.querySelectorAll<HTMLElement>('.p_menu1Item > .p_jtIcon'));
  const toggle = (event: Event) => {
    if (window.innerWidth > 768) return;
    event.preventDefault();
    const item = (event.currentTarget as HTMLElement).closest('.p_level1Item');
    item?.querySelector('.p_level2Box')?.classList.toggle('is-open');
  };
  arrows.forEach((arrow) => arrow.addEventListener('click', toggle));

  return () => {
    openButton?.removeEventListener('click', open);
    closeButton?.removeEventListener('click', close);
    arrows.forEach((arrow) => arrow.removeEventListener('click', toggle));
  };
}

function wireSwipers() {
  const instances: Swiper[] = [];

  // Pages carry both spellings: `.swiper` (banner) and the older
  // `.swiper-container` (galleries, thumb strips). Swiper 11 styles `.swiper`,
  // so tag the old ones before initialising.
  const carousels = Array.from(document.querySelectorAll<HTMLElement>('.swiper, .swiper-container'));
  carousels.forEach((element) => element.classList.add('swiper'));

  const thumbs = new Map<HTMLElement, Swiper>();

  carousels
    .filter((element) => element.classList.contains('gallery-thumbs'))
    .forEach((element) => {
      const instance = new Swiper(element, {
        modules: [Navigation, Thumbs],
        slidesPerView: 4,
        spaceBetween: 10,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
      });
      thumbs.set(element, instance);
      instances.push(instance);
    });

  carousels.forEach((element) => {
    if (element.classList.contains('gallery-thumbs')) return;
    if (element.querySelectorAll('.swiper-slide').length < 2) return;

    const paired = element.classList.contains('gallery-top')
      ? Array.from(thumbs.values())[0]
      : undefined;

    instances.push(
      new Swiper(element, {
        modules: [Navigation, Pagination, Autoplay, Parallax, Thumbs],
        speed: 1200,
        parallax: element.classList.contains('special_a'),
        autoplay: element.classList.contains('special_a')
          ? { delay: 7000, pauseOnMouseEnter: true }
          : false,
        navigation: {
          nextEl: element.querySelector('.p_btn_next, .swiper-button-next') as HTMLElement,
          prevEl: element.querySelector('.p_btn_prev, .swiper-button-prev') as HTMLElement,
        },
        pagination: {
          el: element.querySelector('.p_pagenation, .swiper-pagination') as HTMLElement,
          clickable: true,
        },
        thumbs: paired ? { swiper: paired } : undefined,
      }),
    );
  });

  return instances.map((instance) => () => instance.destroy(true, true));
}

// The template hides most text with `visibility:hidden;opacity:0` and the SaaS
// bundle revealed it on scroll. Hover panels and dropdowns are hidden the same
// way, so only reveal elements that sit in normal document flow.
function wireReveals() {
  const hidden = Array.from(document.querySelectorAll<HTMLElement>('.main *')).filter((element) => {
    const style = getComputedStyle(element);
    if (style.visibility !== 'hidden' || style.opacity !== '0') return false;
    if (style.position !== 'static' && style.position !== 'relative') return false;
    return !element.closest('.p_navContent, .p_level2Box, .p_level3Box');
  });

  // Reveal the outermost hidden element only; children come along with it.
  const targets = hidden.filter((element) => !hidden.some((other) => other !== element && other.contains(element)));

  targets.forEach((element) => {
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    element.style.transform = 'translateY(24px)';
  });

  const reveal = (element: HTMLElement) => {
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px' },
  );

  targets.forEach((element) => observer.observe(element));

  // Anything still hidden when the page is printed or scripted away should not
  // stay invisible for good.
  const failsafe = window.setTimeout(() => targets.forEach(reveal), 6000);

  return () => {
    observer.disconnect();
    window.clearTimeout(failsafe);
  };
}

function wireForms() {
  const forms = Array.from(document.querySelectorAll<HTMLFormElement>('form.hz-form'));
  const handlers = new Map<HTMLFormElement, (event: Event) => void>();

  forms.forEach((form) => {
    const status = form.querySelector<HTMLElement>('.hz-form-status');
    const button = form.querySelector<HTMLButtonElement>('.hz-submit');
    const label = button?.innerHTML ?? '';

    const value = (field: string) => {
      const element = form.elements.namedItem(field);
      return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
        ? element.value
        : '';
    };

    const setStatus = (text: string, kind?: 'success' | 'error') => {
      if (!status) return;
      status.textContent = text;
      status.className = `hz-form-status${kind ? ` is-${kind}` : ''}`;
    };

    const showErrors = (errors: Record<string, string> = {}) => {
      form.querySelectorAll<HTMLElement>('.hz-field-error').forEach((node) => {
        node.textContent = errors[node.dataset.for ?? ''] ?? '';
      });
    };

    const busy = (on: boolean) => {
      if (!button) return;
      button.disabled = on;
      button.innerHTML = on ? '<span>Sending…</span>' : label;
    };

    const onSubmit = async (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      showErrors();
      setStatus('');

      const payload = {
        name: value('name'),
        email: value('email'),
        phone: value('phone'),
        company: value('company'),
        message: value('message'),
        website: value('website'),
        page: window.location.href,
      };

      if (!payload.name.trim() || !payload.email.trim() || payload.message.trim().length < 5) {
        showErrors({
          name: payload.name.trim() ? '' : 'Please enter your name.',
          email: payload.email.trim() ? '' : 'Please enter your email address.',
          message: payload.message.trim().length >= 5 ? '' : 'Please tell us a little more.',
        });
        setStatus('Please complete the required fields.', 'error');
        return;
      }

      busy(true);
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const body = await response.json().catch(() => ({}));

        if (response.ok && body.ok) {
          form.reset();
          setStatus(SENT, 'success');
        } else {
          showErrors(body.errors);
          setStatus(body.error ?? FAILED, 'error');
        }
      } catch {
        setStatus('Network error. Please try again, or email admin@huazeno.com.', 'error');
      } finally {
        busy(false);
      }
    };

    handlers.set(form, onSubmit);
    form.addEventListener('submit', onSubmit);
  });

  return () => handlers.forEach((handler, form) => form.removeEventListener('submit', handler));
}
