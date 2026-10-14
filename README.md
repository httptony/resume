# Tony Tshandu: resume

The current resume is always [`Tony_Tshandu_Resume.pdf`](Tony_Tshandu_Resume.pdf) (Word version alongside it).

## How it stays up to date

- `build_resume.js` is the source. All wording lives there.
- `./build.sh` rebuilds the .docx and .pdf and fails if the resume runs past one page or contains em or en dashes.
- A weekly scheduled Claude task checks for new projects, roles and certs, updates `build_resume.js`, rebuilds, logs the change in `CHANGELOG.md` and commits here.
- To undo an automatic change, revert its commit.

## Style rules

- One page, US Letter, Calibri, teal (#2B7A78) accents.
- Bullets start with a verb, end with a result, and stay within two lines. Use real numbers only.
- No em or en dashes. Plain, human wording in the profile.
- Name the bank client only as "a major South African bank".
