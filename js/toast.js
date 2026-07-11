function showToast(message, type = 'success') {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const icon = type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-information-fill';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
  stack.appendChild(toast);
  setTimeout(() => toast.remove(), 2700);
}
