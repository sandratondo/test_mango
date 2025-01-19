import Link from 'next/link';

export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ padding: "20px" }}>
      <div className="text-center">
        {/* Logo de Mango */}
        <div className="mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Logo_of_Mango_%28new%29.svg/354px-Logo_of_Mango_%28new%29.svg.png"
            alt="Logo de Mango"
            className="img-fluid"
          />
        </div>

        <h4>Prueba técnica</h4>
        <p>Selecciona un ejercicio de rango</p>

        {/* Botones de enlace */}
        <div className="d-flex justify-content-center gap-3">
          <Link href="/exercise1">
            <button className="btn btn-secondary">Ejercicio 1: Rango normal</button>
          </Link>
          <Link href="/exercise2">
            <button className="btn btn-secondary">Ejercicio 2: Rango fijo</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
