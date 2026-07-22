export const CONTACT_DEFAULTS = {
  email: '',
  phone: '',
  preferredContact: 'email',
  // Obscure name — never use "website"/"url" (browsers autofill those)
  cc_hp_field: '',
};

export const PREFERRED_CONTACT_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone call' },
  { value: 'text', label: 'Text message' },
];

export function phoneRequiredFor(preferredContact) {
  return preferredContact === 'phone' || preferredContact === 'text';
}

export function validateContact(form) {
  if (!form.email?.trim()) {
    return 'Email is required.';
  }
  if (phoneRequiredFor(form.preferredContact) && !form.phone?.trim()) {
    return 'Please add a phone number for your preferred contact method.';
  }
  return null;
}

/**
 * Build Formspree payload fields for contact info.
 * Honeypot is mapped to `_gotcha` (Formspree drops filled traps server-side).
 * Never short-circuit with a fake success — that blocked real users when autofill hit the old field.
 */
export function contactPayload(form) {
  const { cc_hp_field, ...rest } = form;
  return {
    ...rest,
    _gotcha: typeof cc_hp_field === 'string' ? cc_hp_field : '',
  };
}

/**
 * Shared email + phone + preferred method + honeypot fields.
 * Email is always required; phone is required when preferred method is phone/text.
 */
export default function ContactFields({ form, onChange, idPrefix = '' }) {
  const phoneRequired = phoneRequiredFor(form.preferredContact);
  const emailId = `${idPrefix}email`;
  const phoneId = `${idPrefix}phone`;
  const preferredId = `${idPrefix}preferredContact`;
  const honeypotId = `${idPrefix}cc_hp_field`;

  return (
    <>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor={honeypotId}>Leave blank</label>
        <input
          id={honeypotId}
          name="cc_hp_field"
          type="text"
          value={form.cc_hp_field}
          onChange={onChange}
          tabIndex={-1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-lpignore="true"
          data-1p-ignore="true"
          data-bwignore="true"
          data-form-type="other"
        />
      </div>

      <div className="form-group">
        <label htmlFor={emailId}>Email</label>
        <input
          id={emailId}
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor={preferredId}>Preferred contact method</label>
        <select
          id={preferredId}
          name="preferredContact"
          value={form.preferredContact}
          onChange={onChange}
          required
        >
          {PREFERRED_CONTACT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor={phoneId}>
          Phone{phoneRequired ? '' : ' (optional)'}
        </label>
        <input
          id={phoneId}
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          required={phoneRequired}
          autoComplete="tel"
        />
      </div>
    </>
  );
}
