# Contributing Guidelines
## Language
Git branch names and commit messages, and GitHub pull request should be written in English in order to be readable for
developers around the world.


## Git branch flow
We adhere GitHub Flow to develop this project. Anything in the `master` branch is deployable. To work on something new, create
a descriptively named branch off of master, also add a prefix `feature/` to its name.
A branch name should be started with verb and the most terse and lucid possible.

```bash
# Example
feature/implement-xxx
feature/support-xxx-for-xxx
feature/fix-xxx-bugs
```

For more details, see [GitHub Flow – Scott Chacon](http://scottchacon.com/2011/08/31/github-flow.html).


## Git commit messages convention
Follow the following format for Git commit messages.

```bash
# Format
[<COMMIT_TYPE>] <SUMMARY>

- <DESCRIPTION>
- <DESCRIPTION>
- <DESCRIPTION>
```

### `<COMMIT_TYPE>`
One commit should have only one purpose, so you should add the following commit type to beginning of line 1 of the commit
message.

| TYPE     | USE CASE                                                  | COMMENTS                                                                      |
|:---------|:----------------------------------------------------------|:------------------------------------------------------------------------------|
| `Add`    | Implement functions/Add files/Support new platform        |                                                                               |
| `Change` | Change current spec                                       | Use this type when breaking changes are happened, otherwise DO NOT use.       |
| `Fix`    | Fix bugs                                                  | Use this type when you fix bugs, otherwise DO NOT use.                        |
| `Modify` | Modify wording                                            | Use this type when breaking changes are not happened and fix other than bugs. |
| `Clean`  | Refactor some codes/Rename classes, methods, or variables |                                                                               |
| `Remove` | Remove unneeded files or libraries                        |                                                                               |
| `Update` | Update dependencies or this project version               |                                                                               |

```bash
# Example
[Add] Implement sign up system
[Clean] Rename XXXClass to YYYClass

# BAD
[Add]Implement sign up system
<Add> Implement sign up system
[ADD] Implement sign up system
[add] Implement sign up system
Add Implement sign up system
```

### `<SUMMARY>`
`<SUMMARY>` is a summary of changes, do not exceed 50 characters including a commit type. Do not include period `.` because
a summary should be expressed one sentence. Also start with upper case.

```bash
# Example
[Add] Implement sign up system
[Clean] Rename XXXClass to YYYClass

# BAD
[Add] implement sign up system
[Add] Implement sign up system. Because ...
```

### `<DESCRIPTION>` (Optional)
`<DESCRIPTION>` is a description what was changed in the commit. Start with upper case and write one description line by line,
also do not include period `.` .

```bash
# Example
[Add] Implement sign up system

- Add sign up pages
- Add sign up form styles

# BAD
[Add] Implement sign up system
- Add sign up pages
- Add sign up form styles

# BAD
[Add] Implement sign up system

- Add sign up pages.
- Add sign up form styles.

# BAD
[Add] Implement sign up system

- add sign up pages
- add sign up form styles
```
