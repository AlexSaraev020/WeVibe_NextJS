interface ValidateFieldsLengthProps {
  username?: string;
  email?: string;
  password?: string;
  title?: string;
  bio?: string;
  description?: string;
}
export const validate__Fields__Length = ({
  username,
  description,
  email,
  password,
  title,
  bio,
}: ValidateFieldsLengthProps) => {
  const MIN_USERNAME_LENGTH = 3;
  const MAX_USERNAME_LENGTH = 50;
  const MIN_PASSWORD_LENGTH = 8;
  const MAX_PASSWORD_LENGTH = 64;
  const MAX_EMAIL_LENGTH = 254;
  const MIN_EMAIL_LENGTH = 6;
  const MIN_TITLE_LENGTH = 2;
  const MAX_TITLE_LENGTH = 50;
  const MIN_BIO_LENGTH = 0;
  const MAX_BIO_LENGTH = 160;
  const MIN_DESCRIPTION_LENGTH = 0;
  const MAX_DESCRIPTION_LENGTH = 300;

  if (
    (username && username.length < MIN_USERNAME_LENGTH) ||
    (username && username.length > MAX_USERNAME_LENGTH)
  ) {
    return `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`;
  }
  if (
    password &&
    (password.length < MIN_PASSWORD_LENGTH ||
      password.length > MAX_PASSWORD_LENGTH)
  ) {
    return `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`;
  }
  if (email && (email.length < MIN_EMAIL_LENGTH || email.length > MAX_EMAIL_LENGTH)) {
    return `Email must be between ${MIN_EMAIL_LENGTH} and ${MAX_EMAIL_LENGTH} characters.`;
  }
  if (
    title &&
    (title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH)
  ) {
    return `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters.`;
  }
  if (
    bio &&
    (bio.length < MIN_BIO_LENGTH ||
      bio.length > MAX_BIO_LENGTH)
  ) {
    return `Bio must be between ${MIN_BIO_LENGTH} and ${MAX_BIO_LENGTH} characters.`;
  }
  if (
    description &&
    (description.length < MIN_DESCRIPTION_LENGTH ||
      description.length > MAX_DESCRIPTION_LENGTH)
  ) {
    return `Description must be between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} characters.`;
  }

  return null;
};
