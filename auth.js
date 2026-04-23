const USERS_STORAGE_KEY = "echochic_users_v1";
const SESSION_STORAGE_KEY = "echochic_session_v1";
const ADMIN_ACCESS_KEY = "ECHO-ADMIN-2026";

function toggleRoleSections(role) {
  document.querySelectorAll("[data-role-only]").forEach((section) => {
    const allowedRoles = (section.getAttribute("data-role-only") || "")
      .split(/\s+/)
      .filter(Boolean);
    const shouldShow = allowedRoles.includes(role);

    section.hidden = !shouldShow;

    section.querySelectorAll("[data-required-when-visible]").forEach((field) => {
      field.required = shouldShow;
    });
  });
}

function setStatusMessage(form, message, isError) {
  const status = form.querySelector("[data-form-status]");
  if (!status) return;

  status.textContent = message;
  status.classList.toggle("error", Boolean(isError));
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function readStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function setActiveSession(session, rememberMe) {
  const data = JSON.stringify(session);
  if (rememberMe) {
    localStorage.setItem(SESSION_STORAGE_KEY, data);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(SESSION_STORAGE_KEY, data);
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

function autoFillLoginEmail() {
  const emailInput = document.querySelector('[data-login-form] input[name="email"]');
  if (!emailInput) return;

  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");
  if (email && !emailInput.value) {
    emailInput.value = email;
  }
}

function createUserFromSignup(form) {
  const role = form.querySelector('input[name="accountRole"]:checked')?.value || "user";

  return {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    role,
    fullName: form.querySelector('input[name="fullName"]')?.value.trim() || "",
    organization: form.querySelector('input[name="organization"]')?.value.trim() || "",
    email: normalizeEmail(form.querySelector('input[name="email"]')?.value),
    phone: form.querySelector('input[name="phone"]')?.value.trim() || "",
    password: form.querySelector('input[name="password"]')?.value || "",
    area: form.querySelector('input[name="area"]')?.value.trim() || "",
    state: form.querySelector('input[name="state"]')?.value.trim() || "",
    chapterName: form.querySelector('input[name="chapterName"]')?.value.trim() || "",
    cleanupDay: form.querySelector('select[name="cleanupDay"]')?.value || "",
    userInterest: form.querySelector('select[name="userInterest"]')?.value || "",
    productCategories: form.querySelector('textarea[name="productCategories"]')?.value.trim() || "",
    capacity: form.querySelector('input[name="capacity"]')?.value.trim() || "",
    sellingPreference: form.querySelector('select[name="sellingPreference"]')?.value || "",
    ngoRegNo: form.querySelector('input[name="ngoRegNo"]')?.value.trim() || "",
    ngoFocus: form.querySelector('select[name="ngoFocus"]')?.value || "",
    adminArea: form.querySelector('select[name="adminArea"]')?.value || "",
    createdAt: new Date().toISOString()
  };
}

const loginRole = document.querySelector('select[name="loginRole"]');
if (loginRole) {
  toggleRoleSections(loginRole.value);
  loginRole.addEventListener("change", () => toggleRoleSections(loginRole.value));
}

const signupRoles = document.querySelectorAll('input[name="accountRole"]');
if (signupRoles.length > 0) {
  const selectedRole =
    document.querySelector('input[name="accountRole"]:checked')?.value || "user";
  toggleRoleSections(selectedRole);

  signupRoles.forEach((roleInput) => {
    roleInput.addEventListener("change", () => {
      toggleRoleSections(roleInput.value);
    });
  });
}

document.querySelectorAll("[data-toggle-password]").forEach((button) => {
  const inputId = button.getAttribute("data-toggle-password");
  const targetInput = inputId ? document.getElementById(inputId) : null;
  if (!targetInput) return;

  button.addEventListener("click", () => {
    const showingPassword = targetInput.type === "text";
    targetInput.type = showingPassword ? "password" : "text";
    button.textContent = showingPassword ? "Show" : "Hide";
  });
});

const loginForm = document.querySelector("[data-login-form]");
if (loginForm) {
  autoFillLoginEmail();

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!loginForm.checkValidity()) {
      loginForm.reportValidity();
      setStatusMessage(loginForm, "Please complete all required login details.", true);
      return;
    }

    const email = normalizeEmail(loginForm.querySelector('input[name="email"]')?.value);
    const password = loginForm.querySelector('input[name="password"]')?.value || "";
    const role = loginForm.querySelector('select[name="loginRole"]')?.value || "user";
    const rememberMe = Boolean(loginForm.querySelector('input[name="rememberMe"]')?.checked);
    const adminKeyInput = loginForm.querySelector('input[name="adminKey"]')?.value.trim() || "";

    const users = readStoredUsers();
    const user = users.find(
      (item) => normalizeEmail(item.email) === email && String(item.role) === role
    );

    if (!user) {
      setStatusMessage(
        loginForm,
        "No account found for this email and role. Please sign up first.",
        true
      );
      return;
    }

    if (user.password !== password) {
      setStatusMessage(loginForm, "Incorrect password. Please try again.", true);
      return;
    }

    if (role === "admin" && adminKeyInput !== ADMIN_ACCESS_KEY) {
      setStatusMessage(loginForm, "Invalid admin access key.", true);
      return;
    }

    const activeSession = {
      userId: user.id,
      name: user.fullName || user.organization || "EchoChic Member",
      email: user.email,
      role: user.role,
      loginAt: new Date().toISOString()
    };

    setActiveSession(activeSession, rememberMe);
    setStatusMessage(loginForm, "Login successful. Redirecting to homepage...", false);

    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 700);
  });
}

const signupForm = document.querySelector("[data-signup-form]");
if (signupForm) {
  const stepOne = signupForm.querySelector('[data-signup-step="1"]');
  const stepTwo = signupForm.querySelector('[data-signup-step="2"]');
  const nextStepButton = signupForm.querySelector("#signup-next-btn");
  const backStepButton = signupForm.querySelector("#signup-back-btn");
  const stepIndicators = signupForm.querySelectorAll("[data-step-indicator]");

  const password = signupForm.querySelector('input[name="password"]');
  const confirmPassword = signupForm.querySelector('input[name="confirmPassword"]');

  const updateStepIndicators = (step) => {
    stepIndicators.forEach((indicator) => {
      indicator.classList.toggle(
        "is-active",
        indicator.getAttribute("data-step-indicator") === String(step)
      );
    });
  };

  const showSignupStep = (step) => {
    if (!stepOne || !stepTwo) return;
    stepOne.hidden = step !== 1;
    stepTwo.hidden = step !== 2;
    updateStepIndicators(step);

    const focusTarget =
      step === 1
        ? stepOne.querySelector("input, select, textarea")
        : stepTwo.querySelector("input, select, textarea");
    if (focusTarget) {
      focusTarget.focus();
    }
  };

  const validatePasswordMatch = () => {
    if (!password || !confirmPassword) return true;
    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity("Passwords do not match.");
      return false;
    }
    confirmPassword.setCustomValidity("");
    return true;
  };

  const validateStep = (stepElement) => {
    if (!stepElement) return false;

    const fields = stepElement.querySelectorAll("input, select, textarea");
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  };

  showSignupStep(1);

  if (nextStepButton) {
    nextStepButton.addEventListener("click", () => {
      validatePasswordMatch();
      if (!validateStep(stepOne)) {
        setStatusMessage(signupForm, "Please complete step 1 before continuing.", true);
        return;
      }
      if (!validatePasswordMatch()) {
        confirmPassword?.reportValidity();
        setStatusMessage(signupForm, "Passwords need to match before continuing.", true);
        return;
      }

      setStatusMessage(signupForm, "", false);
      showSignupStep(2);
    });
  }

  if (backStepButton) {
    backStepButton.addEventListener("click", () => {
      setStatusMessage(signupForm, "", false);
      showSignupStep(1);
    });
  }

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    validatePasswordMatch();

    if (stepOne && !stepOne.hidden) {
      if (!validateStep(stepOne) || !validatePasswordMatch()) {
        if (!validatePasswordMatch()) {
          confirmPassword?.reportValidity();
        }
        setStatusMessage(signupForm, "Please complete step 1 before continuing.", true);
        return;
      }
      showSignupStep(2);
      setStatusMessage(signupForm, "", false);
      return;
    }

    if (!signupForm.checkValidity()) {
      signupForm.reportValidity();
      setStatusMessage(signupForm, "Please complete all required fields correctly.", true);
      return;
    }

    const role = signupForm.querySelector('input[name="accountRole"]:checked')?.value || "user";
    const adminInviteCode = signupForm
      .querySelector('input[name="adminInviteCode"]')
      ?.value.trim();
    const email = normalizeEmail(signupForm.querySelector('input[name="email"]')?.value);

    if (role === "admin" && adminInviteCode !== ADMIN_ACCESS_KEY) {
      setStatusMessage(
        signupForm,
        "Invalid admin invitation code. Use a valid code to create admin account.",
        true
      );
      return;
    }

    const users = readStoredUsers();
    const emailExists = users.some((user) => normalizeEmail(user.email) === email);
    if (emailExists) {
      setStatusMessage(
        signupForm,
        "An account with this email already exists. Please login instead.",
        true
      );
      return;
    }

    const newUser = createUserFromSignup(signupForm);
    users.push(newUser);
    saveStoredUsers(users);

    setStatusMessage(signupForm, "Account created successfully. Redirecting to login...", false);

    window.setTimeout(() => {
      window.location.href = `login.html?email=${encodeURIComponent(newUser.email)}`;
    }, 800);
  });
}
