import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useState } from "react";
import {
  GithubRepository,
  PackageJSONContents,
  RepositoryCountMap,
} from "../entities";

function Home() {
  //Todo: Specify types for all the variables and state variables.
  //Todo: Improve naming convention.
  const [repoType, setRepoType] = useState<Array<GithubRepository>>([]); //Done
  var [dictType, setDictType] = useState<Array<RepositoryCountMap>>([]);
  const [searchText, setSearchText] = useState<string>("");
  let [importedPackages, setImportedPackages] = useState<Array<string>>([]);
  let [packageUrlDetails, setPackageUrlDetails] = useState<Array<string>>([]);
  const getRepositories = async () => {
    let repoUrl = `https://api.github.com/search/repositories?q=${searchText}`;
    //setUrlType(repoUrl);
    try {
      const response = await fetch(repoUrl);
      //Todo: Specify types for all the API responses
      const data = await response.json();

      console.log(data.items);
      setRepoType(data.items);
    } catch (error) {
      console.log(error);
    }
  };
  const importPackage = async (ownerName: string, repoName: string):Promise<Array<string>> => {
    const metaResponse = await fetch(
      `https://raw.githubusercontent.com/${ownerName}/${repoName}/master/package.json`
    );
    const mdata = await metaResponse.json();
    const dependenciesType = Object.keys(mdata.dependencies);
    const devDependenciesType = Object.keys(mdata.devDependencies);
    importedPackages = dependenciesType.concat(devDependenciesType);
    setImportedPackages(importedPackages);
    return importedPackages
  }
  const computeDependencies = async (importedPackages:Array<string>) => {
    let temp = [...dictType];
          for (let j = 0; j < importedPackages.length; j++) {
            let check = false;
            let checkedIndex: null | number = null;
            for (let k = 0; k < temp.length; k++) {
              check = temp[k].name === importedPackages[j];
              if (check) {
                checkedIndex = k;
                break;
              }
            }
            console.log(importedPackages[j] + " Check " + check);
            if (check && checkedIndex!==null) {
              dictType[checkedIndex].count = dictType[checkedIndex].count + 1;
            } else {
              dictType.push({ name: importedPackages[j], count: 1 });
            }
          }
          setDictType(dictType);
  }
  const getMetaData = async (ownerName: string, repoName: string) => {
    let detailsNames = ownerName+repoName;
    if (!packageUrlDetails.includes(detailsNames)) { 
      packageUrlDetails.push(detailsNames);
        console.log("Inner if block")       
        try {
          let importedPackages = await importPackage(ownerName, repoName)
          computeDependencies(importedPackages)
        } catch (error) {
        } finally {
        }      
      setPackageUrlDetails(packageUrlDetails);
      console.log(packageUrlDetails)
    }
  };

  return (
    <>
    <div>
        <Head>
          <title>TopPacks</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </Head>
      </div>
      <nav className="px-4 py-4 bg-purple-900 text-white">
        <ul className="flex">
          <li className="mx-2 cursor-pointer">HomeScreen</li>
          <li className="mx-2 cursor-pointer">TopPacks</li>
          <li className="mx-2">
            <input
              className="text-black"
              type="text"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
            <button className="mx-1 px-3 rounded-2xl hover:bg-slate-800" type="submit" onClick={() => getRepositories()}>
              Fetch
            </button>
          </li>
        </ul>
      </nav>
      <ul>
      <li>
        <div className="bg-slate-500">
          {repoType.map((item) => {
            return (
              <div key={item.id}>
                <h1>Name: {item.name}</h1>
                <h1>Owner: {item.owner.login}</h1>
                <button
                  onClick={() => {
                    getMetaData(item.owner.login, item.name);
                    
                  }}
                >
                  Import
                </button>
              </div>
            );
          })}
        </div>
      </li>     
      <li className="mx-2">
        {importedPackages.length === 0 ? (
          <>No data to display</>
        ) : (
          <h1>Current Import Repository Packages</h1>
        )}
        {importedPackages.map((item) => {
          return (
            <>
              <h1>{item}</h1>
            </>
          );
        })}
      </li>
      <li className="mx-2">
        {dictType.length === 0 ? (
          <>No data to display</>
        ) : (
          <>
            <h1>TopPacks</h1>
          </>
        )}
        {dictType.map((item) => {
          return (
            <>
              <h2>
                {item.name}
                {`- used in ${item.count} repositories`}
              </h2>
            </>
          );
        })}
      </li>
      </ul>
    </>
  );
}

export default Home;
