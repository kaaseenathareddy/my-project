export default function BookList({ books, removeBook }) {
  return (
    <div className="book-list">
      {books.map((book, index) => (
        <div key={index} className="book-item">
          <strong>{book.title}</strong> by {book.author}
          <button onClick={() => removeBook(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
