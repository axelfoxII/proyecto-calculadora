
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'calculadora Angular';

  screen = "";
  a: any;
  b: any;
  c: any;
  d = "";
  e = "";

  objectArray: any = [];
  contenedor: any;
  arrayOperaciones: any = [];
  arrayResultados: any = [];
  operacionesyresult: any = [];
  verOperaciones: any = [];
  verOperacionesStorage: any = [];
  mostrarStorage: any;
  buttonHistory: any;
  btnActive = "text-right";

  @ViewChild('mostrarOperciones', { static: true }) mostrarOperaciones!: ElementRef

  constructor(private renderer: Renderer2) { }


  ngOnInit(): void {

    //Posicion texto del history inicial
    this.buttonHistory = true;
    this.btnActive = 'text-right';


    // Verificacion del variables de localstorage
    this.verOperaciones = localStorage.getItem('operaciones') || [];

    // Se crea el componente history con las variables del storage
    this.crearHtmlStorage()

  }



  // Operacines Matematicas 
  enterValue(value: any) {

    if ((this.b == "+") || (this.b == "-") || (this.b == "*") || (this.b == "/")) {


      this.d = this.d + value;
      this.screen = this.screen + value;
      this.c = this.d;

    } else {

      this.screen = this.screen + value;
      this.a = this.screen;

    }

  }

  condition(value: any) {

    this.screen = this.screen + value;
    this.b = value;

  }

  clear() {
    this.screen = "";
    this.a = "";
    this.b = "";
    this.c = "";
    this.d = "";
  }

  //Resultado y la carga al history con los datos del resultado
  result() {
    if (this.b == "+") {

      this.screen = `${this.screen} = ${(parseInt(this.a) + parseInt(this.c)).toString()}`;
      this.screen = (parseInt(this.screen) + parseInt(this.c)).toString();

      this.objectArray.push(parseInt(this.screen) + parseInt(this.c)).toString();

      // Cargamos el history
      const operacion = `${this.a}${this.b}${this.c}`;
      const resultado = this.screen;

      this.crearHtml(operacion, resultado);

    }

    if (this.b == "-") {

      this.screen = `${this.screen} = ${(parseInt(this.a) - parseInt(this.c)).toString()}`;
      this.screen = (parseInt(this.screen) - parseInt(this.c)).toString();

      const operacion = `${this.a}${this.b}${this.c}`;
      const resultado = this.screen;

      this.crearHtml(operacion, resultado);



    }

    if (this.b == "*") {
      this.screen = `${this.screen} = ${(parseInt(this.a) * parseInt(this.c)).toString()}`;
      this.screen = (parseInt(this.screen) * parseInt(this.c)).toString();
      const operacion = `${this.a}${this.b}${this.c}`;
      const resultado = this.screen;

      this.crearHtml(operacion, resultado);

    }

    if (this.b == "/") {
      this.screen = `${this.screen} = ${(parseInt(this.a) / parseInt(this.c)).toString()}`;
      this.screen = (parseInt(this.screen) / parseInt(this.c)).toString();
      const operacion = `${this.a}${this.b}${this.c}`;
      const resultado = this.screen;

      this.crearHtml(operacion, resultado);

    }

    this.clear();
  }



  // Se crea de forma dinamica el history mediante el DOM
  crearHtml(operacion: any, resultado: any) {

    this.buttonHistory = true;
    const mostrar = {

      operacion,
      resultado
    }


    var containerCard = document.createElement('div');
    var verOperacion = document.createElement('p');
    var verResultado = document.createElement('p');

    containerCard.classList.add('containerCard');
    verOperacion.classList.add('operation');
    verResultado.classList.add('resultOperation');

    containerCard.appendChild(verOperacion);
    containerCard.appendChild(verResultado);

    this.renderer.appendChild(this.mostrarOperaciones.nativeElement, containerCard);
    this.contenedor = containerCard;

    this.arrayOperaciones = [...this.arrayOperaciones, mostrar]

    this.arrayOperaciones.forEach((element: any) => {


      this.contenedor.querySelector('.operation').innerText = element.operacion;
      this.contenedor.querySelector('.resultOperation').innerText = element.resultado;


    })



    this.sincronizarStorage();

  }


  // Sincroniza los datos del history con el storage 
  sincronizarStorage() {
    localStorage.setItem('operaciones', JSON.stringify(this.arrayOperaciones))
  }



  // Si se recarga la pagina vuelve a construir el history con los datos del storage
  crearHtmlStorage() {



    if (this.verOperaciones.length > 0) {

      var containerCard = document.createElement('div');
      var verOperacion = document.createElement('p');
      var verResultado = document.createElement('p');

      containerCard.classList.add('containerCard');
      verOperacion.classList.add('operation');
      verResultado.classList.add('resultOperation');

      containerCard.appendChild(verOperacion);
      containerCard.appendChild(verResultado);

      this.renderer.appendChild(this.mostrarOperaciones.nativeElement, containerCard);
      this.contenedor = containerCard;

      this.arrayResultados = JSON.parse(this.verOperaciones)

      this.arrayResultados.forEach((element: any) => {
        this.crearHtml(element.operacion, element.resultado);
      })



    }

  }

  // Cambia la posiscion del contenido del history
  cambiarPosicion() {


    if (this.buttonHistory) {

      this.buttonHistory = false;
      this.btnActive = 'text-left'

    } else {
      this.buttonHistory = true;
      this.btnActive = 'text-right'

    }
  }

  // EXTRA limpia el history
  limpiarHistory() {


    if (this.arrayOperaciones.length > 0) {

      Swal.fire({
        icon: 'question',
        title: 'DESEA LIMPIAR EL REGISTRO',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      }).then((result) => {

        if (result.isConfirmed) {

          localStorage.removeItem('operaciones');

          Swal.fire({
            icon: 'success',
            title: 'El historial se limpio correctamente...',
            confirmButtonText: 'Aceptar'
          }).then((result) => {

            if (result.value) {
              location.reload();
            }

          })


        }

      })

    } else {

      Swal.fire({
        icon: 'info',
        title: 'EL HISTORIAL ESTA LIMPIO',

      })


    }





  }



}
