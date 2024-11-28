
# Лабораторна робота №2  
**"Розширена робота з git"**

**КВ-21 Шинкаренко Віталій**

## Хід виконання роботи

### 1. Зклонуйте репозиторій для ЛР2, використовуючи локальний репозиторій від ЛР1 як "віддалений"

#### 1.1 Клонування репозиторію

Для початку я створюю нову папку для ЛР2 і переходжу в неї:

```bash
mkdir B:/uni/tirpz~/lab2
cd B:/uni/tirpz~/lab2
```

Далі я використовую локальний репозиторій ЛР1, який знаходиться в папці **`B:/uni/tirpz~`**, і клонуємо його в нову папку для ЛР2 через протокол `file://`:

```bash
$ git clone file:///B:/uni/tirpz%7E/lab1
Cloning into 'lab1'...
remote: Enumerating objects: 100, done.
remote: Counting objects: 100% (100/100), done.
remote: Compressing objects: 100% (50/50), done.
Receiving objects: 100% (100/100), done.
Resolving deltas: 100% (10/10), done.
```

Репозиторій успішно скопійовано. Тепер можна перейти до перевірки гілок.

#### 1.2 Перевірка гілок після клонування

Я перевіряю список гілок у новому репозиторії:

```bash
$ git branch -a
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/master
  remotes/origin/lab1-branch
```

Як я бачу, у репозиторії є локальна гілка `master` та віддалена гілка `lab1-branch`, яку я створював під час виконання ЛР1.

---

### 2. Робота з ремоутами

#### 2.1 Додавання нового ремоуту

Тепер я додаю новий віддалений репозиторій для зручності роботи з іншими джерелами, наприклад, GitHub. Для цього я виконую команду:

```bash
$ git remote add upstream https://github.com/attotem/dashboard.git
```

Перевіряю, чи був доданий новий ремоут:

```bash
$ git remote -v
origin file:///B:/uni/tirpz~/lab1 (fetch)
origin file:///B:/uni/tirpz~/lab1 (push)
upstream https://github.com/attotem/dashboard.git (fetch)
upstream https://github.com/attotem/dashboard.git (push)
```

Я бачу, що ремоут `origin` посилається на мій локальний репозиторій, а ремоут `upstream` тепер вказує на репозиторій на GitHub.

#### 2.2 Створення нової гілки та пуш

Я створюю нову гілку `lab2-branch` від гілки `master` і додаю кілька комітів:

```bash
$ git checkout -b lab2-branch
```

Додаю новий файл і комітую його:

```bash
$ echo "Hello from lab2" > file3.txt
$ git add file3.txt
$ git commit -m "Add file3.txt to lab2-branch"
```

Тепер я пушу нову гілку на віддалений репозиторій:

```bash
$ git push -u origin lab2-branch
fatal: The current branch lab2-branch has no upstream branch.
To push the current branch and set the remote as upstream, use
  git push --set-upstream origin lab2-branch
```

Git повідомляє, що потрібно вказати віддалену гілку для прив'язки. Я використовую ключ `-u`, щоб встановити зв'язок:

```bash
$ git push -u origin lab2-branch
```

Тепер моя локальна гілка `lab2-branch` прив'язана до віддаленого репозиторію, і я можу пушити зміни без додаткових параметрів.

#### 2.3 Додавання ще одного коміту та пуш

Я додаю ще одне зміни в файл `file3.txt`:

```bash
$ echo "More changes" >> file3.txt
$ git add file3.txt
$ git commit -m "Update file3.txt"
```

Далі я пушу зміни на віддалений репозиторій:

```bash
$ git push
```

Тепер зміни успішно пушаться без необхідності вказувати ім'я віддаленої гілки.

#### 2.4 Перевірка гілок на віддаленому репозиторії

Я перевіряю, що нова гілка `lab2-branch` з'явилася на віддаленому репозиторії:

```bash
$ git branch -a
* lab2-branch
  master
  remotes/origin/HEAD -> origin/master
  remotes/origin/lab2-branch
  remotes/origin/master
```

Тепер я бачу, що гілка `lab2-branch` є на віддаленому сервері.

---

### 3. Змерджити гілку, створену при виконанні ЛР1, в поточну гілку `lab2-branch`

Тепер я об'єдную зміни з гілки `lab1-branch` в поточну гілку `lab2-branch`. Для цього:

1. Переключаюся на гілку `lab2-branch`, якщо ще не на ній:

```bash
$ git checkout lab2-branch
```

2. Мерджу зміни з гілки `lab1-branch`:

```bash
$ git merge origin/lab1-branch
```

Перевіряю, що об'єднання пройшло успішно:

```bash
$ git log --oneline --graph
```

Тепер у графіку видно, що зміни з гілки `lab1-branch` були успішно злиті з гілкою `lab2-branch`.

---

### 4. Перенос комітів

#### 4.1 Створення нової гілки та додавання комітів

Я створюю нову гілку `lab2-branch-2` від `master` і додаю кілька нових комітів:

```bash
$ git checkout master
$ git checkout -b lab2-branch-2
$ echo "Commit 1 in lab2-branch-2" > file4.txt
$ git add file4.txt
$ git commit -m "Commit 1 in lab2-branch-2"

$ echo "Commit 2 in lab2-branch-2" > file5.txt
$ git add file5.txt
$ git commit -m "Commit 2 in lab2-branch-2"

$ echo "Commit 3 in lab2-branch-2" > file6.txt
$ git add file6.txt
$ git commit -m "Commit 3 in lab2-branch-2"
```

#### 4.2 Перенос середнього коміту з гілки `lab2-branch-2` в `lab2-branch`

Тепер мені потрібно перенести середній коміт із гілки `lab2-branch-2` в `lab2-branch`:

1. Перевіряю хеш середнього коміту:

```bash
$ git log --oneline
```

2. Переношу цей коміт в гілку `lab2-branch` за допомогою `cherry-pick`:

```bash
$ git checkout lab2-branch
$ git cherry-pick <commit-hash>
```

#### 4.3 Перевірка перенесеного коміту

Я перевіряю, що коміт був успішно перенесений:

```bash
$ git log --pretty=oneline --graph
```

---

### 5. Визначення останнього спільного предка між гілками

Я визначаю останній спільний предок між гілками `lab2-branch` та `lab1-branch`:

```bash
$ git merge-base lab2-branch lab1-branch
```

---

### 6. Робота з ничкою (stash)

#### 6.1 Збереження змін в ничку

Я роблю деякі зміни, але не додаю їх до коміту:

```bash
$ echo "Unstaged changes" > file7.txt
$ git status
```

Зберігаю ці зміни в ничку:

```bash
$ git stash
```

#### 6.2 Додавання ще кількох зм

ін і збереження їх в ничку

```bash
$ echo "Another unstaged change" > file8.txt
$ git stash
```

#### 6.3 Витягування змін з нички

Я витягаю перші збережені зміни:

```bash
$ git stash pop
```

---

### 7. Робота з файлом `.gitignore`

1. Я створюю кілька файлів з розширенням `.kvfpm`:

```bash
$ touch file1.kvfpm file2.kvfpm file3.txt
```

2. Додаю шаблон до `.gitignore`, щоб ігнорувати файли з розширенням `.kvfpm`:

```bash
$ echo "*.kvfpm" >> .gitignore
```

3. Перевіряю статус:

```bash
$ git status
```

---

### 8. Робота з reflog

Я перевіряю лог станів гілок, щоб побачити всі зміни:

```bash
$ git log --pretty=oneline --graph -n 15
```
