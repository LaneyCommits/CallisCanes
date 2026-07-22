export const CONTACT_DEFAULTS = {
  email: '',
  phone: '',
  preferredContact: 'email',
  website: '', // honeypot — leave empty
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

/** Bots fill hidden fields — treat as spam and skip the real submit. */
export function isHoneypotFilled(form) {
  return Boolean(form.website?.trim());
}

/** Strip honeypot and map it to Formspree’s `_gotcha` field. */
export function contactPayload(form) {
  const { website, ...rest } = form;
  return {
    ...rest,
    _gotcha: website || '',
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
  const honeypotId = `${idPrefix}website`;

  return (
    <>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor={honeypotId}>Website</label>
        <input
          id={honeypotId}
          name="website"
          type="text"
          value={form.website}
          onChange={onChange}
          tabIndex={-1}
          autoComplete="off"
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
