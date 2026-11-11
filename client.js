/**
 * Orange theme — Client half.
 *
 * Two mechanisms, both reversible through `ctx.effect`:
 *
 * 1. `theme.overrideTokens` stacks one token layer over the active light/dark
 *    palette. The theme presenter writes every composed token onto <body> as
 *    an inline custom property, so the base theme stays untouched, the layer
 *    re-resolves when the user flips light/dark, and removing the layer
 *    restores the original palette.
 * 2. A plugin-owned <style> tag recolors the artwork that hardcodes
 *    `--dsw-alias-label-primary` instead of the accent tokens: the sidebar
 *    brand mark and wordmark, the blank-session hero fish and headline, and
 *    the host's multicolor language file glyphs. Selectors match the
 *    class-name suffix every CSS-module build keeps (`<hash>_brand`,
 *    `<hash>_explorerRow`, …), so a rebuild with different hashes still
 *    matches.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-orange-theme',
  factory() {
    /** Accent used on the light palette. */
    const LIGHT_ACCENT = '#ea580c';
    /** Accent used on the dark palette (lighter for contrast on dark surfaces). */
    const DARK_ACCENT = '#fb923c';
    /** Hover/active shade of the primary-button fill. */
    const LIGHT_HOVER = '#c2410c';
    const DARK_HOVER = '#fdba74';
    /** Send-button fill: its white icon keeps a readable contrast on this shade. */
    const LIGHT_SEND = '#ea580c';
    const DARK_SEND = '#f97316';
    /** Pale tint for the active sidebar row accent. */
    const LIGHT_TINT = '#ffedd5';
    const DARK_TINT = '#7c2d12';
    /**
     * The running Turn's "Deep diving" status ("深度求索中"): its label/whale
     * color and the shade the animated shimmer sweep paints. The chat plugin's
     * `.running` block maps its local `--dsw-alias-label-shimmer` onto the
     * deep-diving shimmer token, so recoloring these two tokens changes only the
     * color: the sweep mask, timing and keyframes stay exactly as shipped.
     */
    const LIGHT_DIVING = '#c2410c';
    const DARK_DIVING = '#fb923c';
    const LIGHT_DIVING_SHIMMER = '#7c2d12';
    const DARK_DIVING_SHIMMER = '#fdba74';

    /**
     * Token layer for the orange accents: send/primary buttons, switch and
     * checkbox brand color, accent caret, links, the blue "business" accent,
     * the active sidebar row tint, the semantic file-type glyphs, and the
     * running status label plus its shimmer sweep.
     */
    const ACCENT_TOKENS = {
      '--dsw-alias-brand-primary': { light: LIGHT_ACCENT, dark: DARK_ACCENT },
      '--dsw-alias-brand-primary-new-colorprimary-new-color': {
        light: LIGHT_ACCENT,
        dark: DARK_ACCENT,
      },
      '--dsw-alias-button-primary-fill': { light: LIGHT_ACCENT, dark: DARK_ACCENT },
      '--dsw-alias-button-primary-hover': { light: LIGHT_HOVER, dark: DARK_HOVER },
      '--dsw-alias-button-info-fill': { light: LIGHT_SEND, dark: DARK_SEND },
      '--dsw-alias-button-info-hover': { light: DARK_SEND, dark: DARK_ACCENT },
      '--dsw-alias-state-business-primary': { light: LIGHT_ACCENT, dark: DARK_ACCENT },
      '--dsw-alias-link': { light: LIGHT_ACCENT, dark: DARK_ACCENT },
      '--dsw-specific-sidebar-nav-item-active-accent': {
        light: LIGHT_TINT,
        dark: DARK_TINT,
      },
      '--dsh-file-type-icon-color': { light: LIGHT_ACCENT, dark: DARK_ACCENT },
      '--dsw-alias-label-deep-diving': { light: LIGHT_DIVING, dark: DARK_DIVING },
      '--dsw-alias-label-deep-diving-shimmer': {
        light: LIGHT_DIVING_SHIMMER,
        dark: DARK_DIVING_SHIMMER,
      },
    };

    /**
     * Class-name suffixes of the brand artwork containers and glyphs: the
     * sidebar brand row (mark, wordmark, collapsed rail mark) and the
     * blank-session hero (fish glyph and its headline text group).
     */
    const BRAND_SELECTOR =
      ':is([class*="_brand"], [class*="_fallbackBrandName"], [class*="_railMark"], [class*="_titleGroup"], [class*="_fish"])';

    /**
     * The semantic file-type glyphs already ride `--dsh-file-type-icon-color`;
     * the host's multicolor language artwork carries its own colors, so it is
     * shifted onto the same orange tone with a filter that keeps its internal
     * shading. `:not([class*="_icon_"])` leaves the semantic glyphs alone.
     */
    const LANGUAGE_ICON_SELECTOR =
      ':is([class*="_fileIcon"]:not([class*="_icon_"]), [class*="_explorerRow"] > svg:not([class*="_icon_"]))';

    /** Stylesheet for the artwork the token layer cannot reach. */
    const ARTWORK_CSS = [
      `${BRAND_SELECTOR} { color: ${LIGHT_ACCENT} !important; }`,
      `body[data-ds-dark-theme] ${BRAND_SELECTOR} { color: ${DARK_ACCENT} !important; }`,
      `${LANGUAGE_ICON_SELECTOR} { filter: grayscale(1) brightness(1.05) sepia(1) saturate(4) hue-rotate(-12deg); }`,
    ].join('\n');

    return {
      /** The theme registry owns the token layer this plugin stacks onto. */
      inject: ['theme'],
      /**
       * Register the token layer and the artwork stylesheet.
       * @param ctx - Client plugin context.
       */
      apply(ctx) {
        ctx.effect(
          () => ctx.theme.overrideTokens('@local/dsh-orange-theme', ACCENT_TOKENS),
          'orange-theme: accent tokens',
        );
        ctx.effect(() => {
          const style = document.createElement('style');
          style.dataset.dshOrangeTheme = 'artwork';
          style.textContent = ARTWORK_CSS;
          document.head.append(style);
          return () => {
            style.remove();
          };
        }, 'orange-theme: brand and file artwork');
      },
    };
  },
});
