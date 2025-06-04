import React from "react";
import styled from "styled-components";
import { UseGlobalContext } from "../context/context";
import { Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";

const Repos = () => {
  const { repos } = UseGlobalContext();

  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;

    if (!language) return total;

    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
      return total;
    }

    return total;
  }, {});

  // most used per languages
  const mostUsed = Object.values(languages).sort((a, b) => {
    return b.value - a.value;
  });

  // most starts per languages
  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      return { ...item, value: item.stars };
    })
    .slice(0, 5);

  //
  // stars,forks
  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    {
      stars: {},
      forks: {},
    }
  );

  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();

  // mock data
  // const chartData = [
  //   {
  //     label: "HTML",
  //     value: "5",
  //   },
  //   {
  //     label: "CSS",
  //     value: "63",
  //   },
  //   {
  //     label: "Javascript",
  //     value: "32",
  //   },
  // ];

  return (
    <section className="section">
      <Wrapper className="section-center">
        <div>
          <Pie3D data={mostUsed} />
        </div>
        <div>
          <Column3D data={stars} />
        </div>
        <Doughnut2D data={mostPopular} />
        <div>
          <Bar3D data={forks} />
        </div>
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
