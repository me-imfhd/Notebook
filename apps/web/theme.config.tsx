import { useRouter } from "next/router";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";

const theme: DocsThemeConfig = {
  project: {
    link: "https://github.com/100XEnginners/100xnotebook",
  },
  logo: () => (
    <>
      <span
        className="parent"
        style={{ display: "flex", alignItems: "center" }}
      >
        <svg
          height="20"
          viewBox="0 0 100 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m64.8833 1.81335-2.8464 2.84638C47.1274 19.5692 22.9543 19.5692 8.04485 4.65972L5.19848 1.81335c-.93479-.93478-2.45037-.93478-3.38515 0-.93479.93478-.93478 2.45037 0 3.38515L4.6597 8.04487c14.9095 14.90953 14.9095 39.08263 0 53.99213l-2.84637 2.8463c-.93479.9348-.93479 2.4504 0 3.3852.93478.9348 2.45037.9348 3.38515 0l2.84637-2.8464c14.90955-14.9095 39.08255-14.9095 53.99205 0l2.8464 2.8464c.9348.9348 2.4504.9348 3.3852 0 .9347-.9348.9347-2.4504 0-3.3852l-2.8464-2.8463c-14.9095-14.9095-14.9095-39.0826 0-53.99213l2.8464-2.84637c.9347-.93478.9347-2.45037 0-3.38515-.9348-.93478-2.4504-.93478-3.3852 0Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <h1 style={{ fontSize: "24px", fontWeight: "500" }}>100XNotebook</h1>
      </span>
      <style jsx>{`
        .parent svg,
        .parent h1 {
          mask-image: linear-gradient(
            60deg,
            black 25%,
            rgba(0, 0, 0, 0.2) 50%,
            black 75%
          );
          mask-size: 400%;
          mask-position: 0%;
        }
        .parent:hover svg,
        .parent:hover h1 {
          mask-position: 100%;
          transition:
            mask-position 1s ease,
            -webkit-mask-position 1s ease;
        }
      `}</style>
    </>
  ),
  docsRepositoryBase: "https://github.com/100XEnginners/100xnotebook/tree/main/apps/web",
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== "/") {
      return {
        titleTemplate: "%s – 100XNotebook",
      };
    }
    return;
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { title } = useConfig();
    const url =
      "https://100xnotebook.vercel.app" +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    return (
      <>
        <meta property="og:url" content={url} />
        <meta
          property="og:title"
          content={title ? title + " – 100XNotebook" : "100XNotebook"}
        />
        <meta
          property="og:description"
          content={"100xdevs Notebook."}
        />
      </>
    );
  },
  darkMode: true,
  nextThemes: {
    defaultTheme: "dark",
  },
  sidebar: {
    titleComponent({ title, type }) {
      if (type === "separator") {
        return <span className="cursor-default">{title}</span>;
      }
      return <>{title}</>;
    },
    defaultMenuCollapseLevel: 2,
    toggleButton: true,
  },
  footer: { text: `${new Date().getFullYear()} © Fahad` },
  toc: { float: true, backToTop: true },
};
export default theme;
