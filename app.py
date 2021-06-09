from flask import Flask, render_template, request, session,  redirect, url_for
import sqlite3

app = Flask(__name__)

app.secret_key = 'fkdjsafjdkfdlkjfadskjfadskljdsfklj'

#Open database
conn = sqlite3.connect('database.db')
c = conn.cursor()

@app.route('/')
def index():
    if 'name' in session:
        username = session['name']
        loginTF = True
    else:
        username = ""
        loginTF = False
    print(session)
    print(username)
    print(loginTF)
    with sqlite3.connect('database.db') as conn:
        cur = conn.cursor()
        cur.execute('SELECT * FROM book')
        itemData = cur.fetchall()
    print(itemData)
    return render_template("index.html", itemData=itemData, loginTF=loginTF, username=username)

@app.route('/login', methods = ['POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        if is_valid(email, password):
            return redirect(url_for('index'))
        else:
            error = 'Invalid UserId / Password'
            print(error)
            return redirect(url_for('index'))

@app.route('/logout')
def logout():
   # remove the username from the session if it is there
   session.pop('name', None)
   return redirect(url_for('index'))


@app.route("/adduser", methods = ['POST'])
def adduser():
    if request.method == 'POST':
        #Parse form data
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']

        with sqlite3.connect('database.db') as con:
            cur = con.cursor()
            cur.execute('INSERT INTO users (password, email, name) VALUES (?, ?, ?)', (password, email, name))
            con.commit()

        return redirect(url_for('index'))

def is_valid(email, password):
    with sqlite3.connect('database.db') as con:
        cur = con.cursor()
        cur.execute('SELECT name, email, password FROM users')
        data = cur.fetchall()
        for row in data:
            if row[1] == email and row[2] == password:
                session['name'] = row[0]
                return True
    return False

@app.route('/register')
def register():
    return render_template("register.html")

@app.route('/mybook')
def mybook():
    if 'name' in session:
        username = session['name']
        loginTF = True
    else:
        username = ""
        loginTF = False
    with sqlite3.connect('database.db') as conn:
        cur = conn.cursor()
        cur.execute('SELECT * FROM borrowList')
        itemData = cur.fetchall()
    return render_template("mybook.html", itemData=itemData, loginTF=loginTF, username=username)

@app.route('/search')
def search():
    if 'name' in session:
        username = session['name']
        loginTF = True
    else:
        username = ""
        loginTF = False
    searchkey = request.args.get("searchkey")
    with sqlite3.connect('database.db') as conn:
        print(searchkey)
        cur = conn.cursor()
        if (searchkey != None):
            cur.execute("SELECT * FROM book where `name` LIKE ?", (f'%{searchkey}%',))
        else:
            cur.execute("SELECT * FROM book ")
        itemData = cur.fetchall()
    return render_template("search.html", itemData=itemData, loginTF=loginTF, username=username)

@app.route('/about')
def about():
    if 'name' in session:
        username = session['name']
        loginTF = True
    else:
        username = ""
        loginTF = False
    return render_template("about.html", loginTF=loginTF, username=username)

@app.route('/rule')
def rule():
    if 'name' in session:
        username = session['name']
        loginTF = True
    else:
        username = ""
        loginTF = False
    return render_template("rule.html", loginTF=loginTF, username=username)

@app.route('/book')
def book():
    if 'name' in session:
        username = session['name']
        loginTF = True
    else:
        username = ""
        loginTF = False
    bookId = request.args.get("bookId")
    with sqlite3.connect('database.db') as conn:
        cur = conn.cursor()
        cur.execute('SELECT * FROM book where `id`='+bookId)
        itemData = cur.fetchall()
        cur.execute('SELECT * FROM comment where `bookId`=? ORDER BY `commentId` DESC ', (bookId))
        comment = cur.fetchall()
    return render_template("book.html", itemData=itemData, comment=comment, loginTF=loginTF, username=username)

@app.route('/comment/delete',methods=['POST'])
def delete_comment():
    commentId = request.values['commentId']
    with sqlite3.connect('database.db') as conn:
        cur = conn.cursor()
        cur.execute('DELETE FROM comment where `commentId`='+commentId)
    return "delete comment"+commentId

@app.route('/comment/edit',methods=['POST'])
def edit_comment():
    commentId = request.values['commentId']
    name = request.values['name']
    message = request.values['message']
    time = request.values['time']
    with sqlite3.connect('database.db') as conn:
        cur = conn.cursor()
        cur.execute('UPDATE comment SET name = ?, message = ? where `commentId` = ?', (name, message, commentId))
    return "edit comment"+commentId

@app.route('/comment/add',methods=['POST'])
def add_comment():
    bookId = request.values['bookId']
    name = request.values['name']
    message = request.values['message']
    time = request.values['time']

    with sqlite3.connect('database.db') as conn:
        cur = conn.cursor()
        cur.execute('INSERT INTO comment(bookId, name, message, time) VALUES (?,?,?,?)', (bookId, name, message, time))
    return "add comment"

@app.route('/borrowBook',methods=['POST'])
def borrowBook():
    username = "柯建亨"
    bookname = request.values['bookname']
    borrowTime = request.values['time']
    with sqlite3.connect('database.db') as conn:
        cur = conn.cursor()
        cur.execute('UPDATE book SET status = ? where `name` = ?', (username, bookname))
        cur.execute('INSERT INTO borrowList (username, bookname, borrowTime) VALUES (?, ?, ?)', (username, bookname, borrowTime))
    return "borrowBook"+bookname

@app.route('/returnBook',methods=['POST'])
def returnBook():
    username = "柯建亨"
    bookname = request.values['bookname']
    returnTime = request.values['time']
    with sqlite3.connect('database.db') as conn:
        cur = conn.cursor()
        cur.execute('UPDATE book SET status = ? where `name` = ?', (None, bookname))
        cur.execute('UPDATE borrowList SET returnTime = ? where `bookname` = ?', (returnTime, bookname))
    return "returnBook"+bookname

if __name__== '__main__':
    app.run(debug=True)
