'use strict'
const forms = document.querySelectorAll('.needs-validation');
for (let i = 0; i < forms.length; i++) {
    const form = forms[i];
    form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    }, false);
}