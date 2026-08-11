import css from './Logo.module.css';

const Logo = () => {
  return (
    <svg width="165" height="46" className={css.logo} aria-label="Logo" role="img">
      <use href="/icons/sprite.svg#icon-logo"></use>
    </svg>
  );
};

export default Logo;
