function ErrorMessage({ onRetry }) {
  return (
    <div className="error-message" role="alert">
      <p>Помилка завантаження даних</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Спробувати ще раз
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
