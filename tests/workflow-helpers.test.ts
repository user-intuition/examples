import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyWebhook, waitForJob } from "../src/workflow-helpers.ts";

test("validates a shared signing vector and rejects changed bytes, stale and future deliveries", () => {
  const raw=Buffer.from('{"id":"evt_1"}'), sig='sha256=9a87814c353fb728b2a0563fc1b83be3f731d47017373fd4cf10c07c21eccf6f';
  assert.equal(verifyWebhook(raw,'1000',sig,'secret',{nowSeconds:1000}),true);
  for(const [body,ts,signature,secret,now] of [[Buffer.from('{}'),'1000',sig,'secret',1000],[raw,'1000',sig,'wrong',1000],[raw,'1000',sig,'secret',1400],[raw,'1000',sig,'secret',600],[raw,'1000','sha256=bad','secret',1000]] as const)
    assert.equal(verifyWebhook(body,ts,signature,secret,{nowSeconds:now}),false);
});
test("polls only the same job and returns success", async () => {
  let calls=0;
  const result=await waitForJob('job',async id=>({job_id:id,status:++calls===2?'succeeded':'running'}),{intervalMs:0});
  assert.equal(result.status,'succeeded');assert.equal(calls,2);
});
test("propagates failure, wrong IDs, unknown states and read errors", async () => {
  await assert.rejects(waitForJob('job',async()=>({job_id:'job',status:'failed',error:'rejected'})),/rejected/);
  await assert.rejects(waitForJob('job',async()=>({job_id:'other',status:'succeeded'})),/different job/);
  await assert.rejects(waitForJob('job',async()=>{throw Error('read failure')}),/read failure/);
});
test("can cancel a reader that ignores the signal", async () => {
  const controller=new AbortController();
  const pending=waitForJob('job',async()=>new Promise<{job_id:string;status:'pending'}>(()=>{}),{signal:controller.signal});
  controller.abort(new Error('cancelled'));
  await assert.rejects(pending,/cancelled/);
});
