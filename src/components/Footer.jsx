export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-300 text-base-content items-center p-4">
      <aside className="flex items-center gap-4">
        <div className="flex flex-col">
          <h3 className="font-bold text-xl">MongMong</h3>
          <p className="text-sm">Copyright © {new Date().getFullYear()} - All right reserved</p>
        </div>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a href="#" aria-label="Twitter" className="cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
          </svg>
        </a>
        <a href="#" aria-label="GitHub" className="cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
            <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.93 3.19 9.1 7.61 10.57.56.1.77-.24.77-.54 0-.27-.01-1-.02-1.95-3.09.67-3.74-1.49-3.74-1.49-.5-1.27-1.22-1.61-1.22-1.61-.99-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.97 1.66 2.54 1.18 3.16.9.1-.71.38-1.18.69-1.45-2.47-.28-5.07-1.23-5.07-5.48 0-1.21.43-2.2 1.13-2.98-.11-.28-.49-1.42.11-2.97 0 0 .92-.29 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.42 3.02-1.13 3.02-1.13.6 1.55.22 2.69.11 2.97.7.78 1.13 1.77 1.13 2.98 0 4.25-2.6 5.2-5.08 5.48.39.34.74 1.02.74 2.06 0 1.49-.01 2.69-.01 3.05 0 .3.2.65.78.54C20.06 20.85 23.25 16.68 23.25 11.75 23.25 5.48 18.27.5 12 .5z" />
          </svg>
        </a>
      </nav>
    </footer>
  );
}
