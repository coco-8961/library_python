from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__)

#Open database
conn = sqlite3.connect('database.db')
c = conn.cursor()

@app.route('/')
def index():
    with sqlite3.connect('database.db') as conn:
        cur = conn.cursor()
        cur.execute('SELECT * FROM book')
        itemData = cur.fetchall()
    return render_template("index.html", itemData=itemData)

@app.route('/mybook')
def mybook():
    return render_template("mybook.html")

@app.route('/search')
def search():
    searchkey = request.args.get("searchkey")
    with sqlite3.connect('database.db') as conn:
        cur = conn.cursor()
        cur.execute("SELECT * FROM book where `name` LIKE '%s'", searchkey)
        itemData = cur.fetchall()
        print(itemData)
    return render_template("search.html", itemData=itemData)

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/rule')
def rule():
    return render_template("rule.html")

@app.route('/book')
def book():
    bookId = request.args.get("bookId")
    with sqlite3.connect('database.db') as conn:
        cur = conn.cursor()
        cur.execute('SELECT * FROM book where `id`='+bookId)
        itemData = cur.fetchall()
        cur.execute('SELECT * FROM comment where `bookId`=? ORDER BY `commentId` DESC ', (bookId))
        comment = cur.fetchall()
    return render_template("book.html", itemData=itemData, comment=comment)

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

if __name__== '__main__':
    app.run(debug=True)
