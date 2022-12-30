# dateup

Update your outdated npm packages interactively.

# Usage

```sh
% cd your-project
% npx dateup
```

The `dateup` command checks outdated packages and **suggests** `npm install` command you would like to run.
Don't worry, it doesn't change, destroy, nor crash anything.

# Why?

We often do something like below:

```sh
# Check outdated
% npm outdated
Package                             Current    Wanted    Latest
@actions/core                         1.9.1    1.10.0    1.10.0
@actions/github                       5.0.0     5.1.1     5.1.1
@fortawesome/fontawesome-svg-core    1.2.36    1.2.36     6.2.1
@fortawesome/free-brands-svg-icons   5.15.4    5.15.4     6.2.1

# Then update
% npm install --save-dev \
   @actions/core@1.10.0 \
   @actions/github@5.1.1 \
   # and more ...
```

The `dateup` just makes this process interactive and frees you from copy-n-pasting package names and their versions.
