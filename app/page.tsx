import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import CrearCuenta from "./crear-cuenta/page";
import LoginComponent from "./component/login/login";

export default function Home() {
  return (
    <section>
      <LoginComponent />
    </section>
  );
}
