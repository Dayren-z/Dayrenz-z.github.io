document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addTaskButton = document.getElementById("addTaskButton");
  const voiceButton = document.getElementById("voiceButton");
  const voiceStatus = document.getElementById("voiceStatus");
  const taskList = document.getElementById("taskList");

  // Verificar compatibilidad con Web Speech API
  const isSpeechRecognitionSupported =
    "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  if (!isSpeechRecognitionSupported) {
    voiceButton.disabled = true;
    voiceStatus.textContent =
      "El reconocimiento de voz no está soportado en tu navegador.";
  }

  let recognition;
  if (isSpeechRecognitionSupported) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-ES";

    recognition.onstart = function () {
      voiceButton.classList.add("listening");
      voiceStatus.textContent = "Escuchando... Habla ahora.";
    };
    recognition.onresult = function (event) {
      let final = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      taskInput.value = final || interim;
      if (final) addTask();
    };

    recognition.onerror = function (event) {
      voiceButton.classList.remove("listening");
      voiceStatus.textContent = "Error: " + event.error;
    };

    recognition.onend = function () {
      voiceButton.classList.remove("listening");
      voiceStatus.textContent =
        "Presiona el botón de voz para agregar una tarea";
    };
  }

  voiceButton.addEventListener("click", function () {
    if (isSpeechRecognitionSupported) {
      try {
        recognition.start();
      } catch (e) {
        voiceStatus.textContent =
          "Error al iniciar el reconocimiento de voz: " + e.message;
      }
    }
  });

  // Función para agregar una tarea
  function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
      const newTask = document.createElement("li");

      // Crear un span para el texto de la tarea
      const taskTextSpan = document.createElement("span");
      taskTextSpan.textContent = taskText;

      // Contenedor para los botones (check y delete)
      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");

      // Botón de check (marcar como completada)
      const checkButton = document.createElement("button");
      checkButton.innerHTML = "&#10003;"; // Símbolo de check (✓)
      checkButton.classList.add("check-button");
      checkButton.onclick = function () {
        taskTextSpan.classList.toggle("completed");
      };

      // Botón de delete (eliminar tarea)
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "&#128465;"; // Símbolo de papelera (🗑)
      deleteButton.classList.add("delete-button");
      deleteButton.onclick = function () {
        taskList.removeChild(newTask);
      };

      // Agregar botones al contenedor
      buttonContainer.appendChild(checkButton);
      buttonContainer.appendChild(deleteButton);

      // Agregar elementos al li
      newTask.appendChild(taskTextSpan);
      newTask.appendChild(buttonContainer);

      // Agregar la tarea a la lista
      taskList.appendChild(newTask);

      // Limpiar el campo de entrada
      taskInput.value = "";
    } else {
      alert("Por favor, escribe una tarea.");
    }
  }

  // Agregar tarea al hacer clic en el botón
  addTaskButton.addEventListener("click", addTask);

  // Agregar tarea al presionar Enter en el campo de texto
  taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });
});
