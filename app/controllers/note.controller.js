const Note = require("../models/note.model");

exports.create = (req, res) => {
  if (!req.body.content) {
    return res.status(400).send({
      message: "Mesaj boş geçilemez!",
    });
  }

  const note = new Note({
    title: req.body.title || "Untitled note",
    content: req.body.content,
  });

  note
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err.message.json());
    });
};

exports.findAll = (req, res) => {
  Note.find()
    .then((notes) => {
      res.send(notes);
    })
    .catch((err) => {
      res.status(500).send(err.message.json());
    });
};

exports.findOne = (req, res) => {
  Note.findById(req.params.noteId)
    .then((note) => {
      if (!note) {
        return res.status(404).send({
          message: "Bulunamadı",
        });
      }

      res.send(note);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: `Bu id'ye göre bulunamadı! ${req.params.noteId}`,
        });
      }
      return res.status(500).send({
        message: `Hata oluştu ${req.params.noteId}, ${err.message}`,
      });
    });
};

exports.update = (req, res) => {
  if (!req.body.content) {
    return res.status(400).send({
      message: `Boş geçilemez`,
    });
  }

  Note.findByIdAndUpdate(
    req.params.noteId,
    {
      title: req.body.title || "Untitled note",
      content: req.body.content,
    },
    { new: true }
  )
    .then((note) => {
      if (!note) {
        return res.status(404).send({
          message: `Bu id'ye göre bulunamadı!  ${req.params.noteId}`,
        });
      }
      res.send(note);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: `Bu id'ye göre bulunamadı!  ${req.params.noteId}`,
        });
      }
      return res.status(500).send({
        message: `Bir hata oluştu: ${req.params.noteId}, ${err.message}`,
      });
    });
};

exports.delete = (req, res) => {
  Note.findByIdAndRemove(req.params.noteId)
    .then((note) => {
      if (!note) {
        return res.status(404).send({
          message: "Bulunamadı! " + req.params.noteId,
        });
      }
      res.send({
        message: `Not silindi!`,
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Silinecek öge bulunamadı " + req.params.noteId,
        });
      }
      return res.status(500).send({
        message: "Bulunamadı! " + req.params.noteId,
      });
    });
};
